import { Prisma, PrismaClient } from "@prisma/client";

export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;
