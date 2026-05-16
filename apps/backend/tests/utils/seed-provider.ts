import fs from "fs";
import path from "path";
import { TestSeed } from "./seed";

export const seedProvider = async (testFn: (seed: TestSeed) => Promise<void>): Promise<void> => {
	const seedFilePath = path.join(__dirname, "seed.json");

	const seed = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));
	await testFn(seed);
};
