import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    globalSetup: ["./tests/utils/jest.global-setup.ts"],
    globalTeardown: ["./tests/utils/jest.global-teardown.ts"],

    pool: "vmThreads",
    maxWorkers: 8,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules", "tests/utils"],
    },

    include: ["tests/**/*.test.ts"],
  },

  resolve: {
    alias: {
      "@packages": path.resolve(__dirname, "../../packages"),
      "@tests": path.resolve(__dirname, "tests"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
