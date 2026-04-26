import { PrismaClient } from "@prisma/client";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { seedDatabase, TestSeed } from "./seed";

let container: StartedPostgreSqlContainer;
let _prisma: PrismaClient | undefined;

const configFilePath = path.join(__dirname, "test-config.json");

export async function startContainer() {
  if (container) return;

  container = await new PostgreSqlContainer()
    .withCommand([
      "postgres",
      "-c",
      "fsync=off",
      "-c",
      "synchronous_commit=off",
      "-c",
      "full_page_writes=off",
    ])
    .start();

  const dbUrl = container.getConnectionUri();
  process.env.DATABASE_URL = dbUrl;

  execSync("pnpm exec prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: "inherit",
  });

  _prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  await _prisma.$queryRaw`SELECT 1`;

  const seed = await seedDatabase(_prisma);

  fs.writeFileSync(
    configFilePath,
    JSON.stringify({
      database_url: dbUrl,
      seed,
    }),
  );
}

export async function stopContainer() {
  await _prisma?.$disconnect();
  await container?.stop();
}

export function initializeTestCase(): {
  prisma: PrismaClient;
  seed: TestSeed;
} {
  const { database_url, seed } = JSON.parse(
    fs.readFileSync(configFilePath, "utf-8"),
  );

  if (!_prisma) {
    _prisma = new PrismaClient({
      datasources: {
        db: {
          url: database_url + "?connection_limit=2",
        },
      },
    });
  }

  return { prisma: _prisma, seed };
}
