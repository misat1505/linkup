import app from "@/app";
import { FileStorage } from "@/lib/FileStorage";
import { PrismaClientOrTransaction } from "@/types/Prisma";
import { initializeServices } from "@/utils/initializeServices";
import { Application } from "express";
import { mockFileStorage } from "./mocks";
import { TestSeed } from "./seed";
import { initializeTestCase } from "./setupTests";

type TransactionProvidedValues = {
  tx: PrismaClientOrTransaction;
  app: Application;
  seed: TestSeed;
};

class RollbackError extends Error {
  constructor() {
    super("__ROLLBACK__");
  }
}

export const testWithTransaction = async (
  testFn: ({ tx, app, seed }: TransactionProvidedValues) => Promise<void>,
): Promise<void> => {
  try {
    const { prisma, seed } = initializeTestCase();
    return await prisma.$transaction(async (tx) => {
      app.services = initializeServices(tx);
      app.services.fileStorage = mockFileStorage as unknown as FileStorage;
      await testFn({ tx, app, seed });
      throw new RollbackError();
    });
  } catch (e: unknown) {
    if (e instanceof RollbackError) {
      return;
    }
    throw e;
  }
};
