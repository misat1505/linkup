import path from "path";
import { defineConfig } from "vitest/config";

const testFiles = ["tests/**/*.test.ts"];

const integrationTests = [
  "./tests/routes/**/*.test.ts",
  "./tests/services/**/*.test.ts",
  "./tests/i18n.test.ts",
];

const alias = {
  "@packages": path.resolve(__dirname, "../../packages"),
  "@tests": path.resolve(__dirname, "tests"),
  "@": path.resolve(__dirname, "src"),
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "integration",
          environment: "node",
          pool: "vmThreads",
          maxWorkers: 8,
          globalSetup: ["./tests/utils/test-global-setup.ts"],
          globalTeardown: ["./tests/utils/test-global-teardown.ts"],
          include: integrationTests,
        },
        resolve: { alias },
      },
      {
        test: {
          name: "unit",
          environment: "node",
          pool: "vmThreads",
          maxWorkers: 8,
          include: testFiles,
          exclude: integrationTests,
        },
        resolve: { alias },
      },
    ],
  },

  coverage: {
    provider: "v8",
    reporter: ["text", "html"],
    exclude: ["node_modules", "tests/utils"],
  },
});
