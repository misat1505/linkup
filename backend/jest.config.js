/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxConcurrency: 1,
  globalSetup: "<rootDir>/tests/utils/jest.global-setup.ts",
  globalTeardown: "<rootDir>/tests/utils/jest.global-teardown.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
};
