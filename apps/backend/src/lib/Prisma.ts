import { env } from "@/config/env";
import { PrismaClient } from "@prisma/client";

/**
 * An instance of the PrismaClient to interact with the database.
 *
 * @example
 * const user = await prisma.user.findUnique({ where: { id: 1 } });
 *
 * @source
 */
export const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL });
