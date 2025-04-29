import { Application } from "express";
import { initializeTestCase } from "./setupTests";
import { TestSeed } from "./seed";
import { PrismaClientOrTransaction } from "../../src/types/Prisma";
import app from "../../src/app";
import { initializeServices } from "../../src/utils/initializeServices";
import { mockFileStorage } from "./mocks";

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
  testFn: ({ tx, app, seed }: TransactionProvidedValues) => Promise<void>
): Promise<void> => {
  try {
    const { prisma, seed } = initializeTestCase();
    return await prisma.$transaction(async (tx) => {
      app.services = initializeServices(tx);
      app.services.fileStorage = mockFileStorage as any;
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
