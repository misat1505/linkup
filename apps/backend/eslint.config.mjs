import tseslint from "typescript-eslint";
import rootConfig from "../../eslint.config.mjs";

export default tseslint.config(
  ...rootConfig,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      "build/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "docs/**",
      "load-tests-report/**",
      "logs/**",
      "prisma/**",
      "prisma.config.ts",
      "tsup.config.ts",
      "vitest.config.ts",
      "eslint.config.mjs",
    ],
  },
);
