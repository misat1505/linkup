import { initializeTestCase } from "./setupTests";
import { TestSeed } from "./seed";

export const seedProvider = async (
  testFn: (seed: TestSeed) => Promise<void>
): Promise<void> => {
  const { seed } = initializeTestCase();
  await testFn(seed);
};
