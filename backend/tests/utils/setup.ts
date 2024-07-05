import { db } from "../../src/lib/DatabaseConnector";

export const testsWithTransactions = () => {
  beforeEach(async () => {
    await db.connection?.beginTransaction();
  });

  afterEach(async () => {
    await db.connection?.rollback();
  });
};
