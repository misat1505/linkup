/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxConcurrency: 1,
  globalSetup: "<rootDir>/tests/utils/jest.global-setup.ts",
  globalTeardown: "<rootDir>/tests/utils/jest.global-teardown.ts",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/utils/"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
  },
};
