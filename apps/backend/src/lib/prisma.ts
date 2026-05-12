import { env } from "@/config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * An instance of the PrismaClient to interact with the database.
 *
 * @example
 * const user = await prisma.user.findUnique({ where: { id: 1 } });
 *
 * @source
 */

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});
