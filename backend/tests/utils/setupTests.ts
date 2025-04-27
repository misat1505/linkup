import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { seedDatabase, TestSeed } from "./seed";

let container: StartedPostgreSqlContainer;
let _prisma: PrismaClient | undefined;
const configFilePath = path.join(__dirname, "test-config.json");

let seed: TestSeed;

export async function startContainer() {
  if (container) return;

  container = await new PostgreSqlContainer().start();

  const dbUrl = container.getConnectionUri();
  console.log(dbUrl);
  process.env.DATABASE_URL = dbUrl;

  execSync("npx prisma db push", {
    env: { DATABASE_URL: dbUrl },
    stdio: "inherit",
  });

  _prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  const seed = await seedDatabase(_prisma);

  fs.writeFileSync(
    configFilePath,
    JSON.stringify({ database_url: dbUrl, seed })
  );
}

export async function stopContainer() {
  await _prisma?.$disconnect();
  await container.stop();
}

export function initializeTestCase(): { prisma: PrismaClient; seed: TestSeed } {
  const jsonData = JSON.parse(fs.readFileSync(configFilePath).toString());

  const dbUrl = jsonData.database_url;
  seed = jsonData.seed;

  _prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  return { prisma: _prisma, seed };
}
