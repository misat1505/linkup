import app from "@/app";
import { FileStorage } from "@/lib/file-storage";
import { PrismaClientOrTransaction } from "@/types/prisma";
import { initializeServices } from "@/utils/initialize-services";
import { Application } from "express";
import { mockFileStorage } from "./mocks";
import { TestSeed } from "./seed";
import { initializeTestCase } from "./setup-tests";

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
