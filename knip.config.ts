import type { KnipConfig } from "knip";

export default {
  ignore: ["apps/backend/typedoc.json", "benchmarks/**"],
  ignoreBinaries: ["tsc", "artillery"],
  ignoreDependencies: ["dotenv-cli", "lint-staged", "@commitlint/cli"],
  prisma: false,
  workspaces: {
    "apps/backend": {
      entry: ["tests/**/*.ts"],
      project: ["src/**/*.ts", "tests/**/*.ts"],
    },
    "apps/web-react": {
      entry: [],
      project: ["src/**/*.{ts,tsx,css}"],
    },
    "apps/web-next": {
      entry: [
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/**/error.tsx",
        "app/**/not-found.tsx",
        "app/**/route.ts",
      ],
      project: ["**/*.{ts,tsx,css}", "!node_modules/**"],
    },
  },
} satisfies KnipConfig;
