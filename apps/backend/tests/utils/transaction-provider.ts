import { PrismaClientOrTransaction } from "@/types/prisma";
import { TestSeed } from "./seed";
import { initializeTestCase } from "./setup-tests";

type TransactionProvidedValues = {
  tx: PrismaClientOrTransaction;
  seed: TestSeed;
};

class RollbackError extends Error {
  constructor() {
    super("__ROLLBACK__");
  }
}

export const transactionProvider = async (
  testFn: ({ tx, seed }: TransactionProvidedValues) => Promise<void>,
): Promise<void> => {
  try {
    const { prisma, seed } = initializeTestCase();
    return await prisma.$transaction(async (tx) => {
      await testFn({ tx, seed });
      throw new RollbackError();
    });
  } catch (e: unknown) {
    if (e instanceof RollbackError) {
      return;
    }
    throw e;
  }
};
