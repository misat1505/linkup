import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const port = 3001;

const uiRoot = path.resolve(__dirname, "../../packages/ui/dist");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port,
    fs: {
      allow: [".."],
    },
  },
  preview: {
    host: true,
    port,
  },
  optimizeDeps: {
    exclude: ["@packages/ui"],
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: "@packages/schemas",
        replacement: path.resolve(__dirname, "../../packages/schemas/src"),
      },
      {
        find: "@packages/api-contract",
        replacement: path.resolve(__dirname, "../../packages/api-contract/src"),
      },
      {
        find: "@packages/ui/features/login",
        replacement: `${uiRoot}/components/features/login/index.js`,
      },
      {
        find: "@packages/ui/features/posts",
        replacement: `${uiRoot}/components/features/posts/index.js`,
      },
      {
        find: "@packages/ui/features/friends",
        replacement: `${uiRoot}/components/features/friends/index.js`,
      },
      {
        find: "@packages/ui/features/home",
        replacement: `${uiRoot}/components/features/home/index.js`,
      },
      {
        find: "@packages/ui/features/settings",
        replacement: `${uiRoot}/components/features/settings/index.js`,
      },
      {
        find: "@packages/ui/features/signup",
        replacement: `${uiRoot}/components/features/signup/index.js`,
      },
      {
        find: "@packages/ui/features/editor",
        replacement: `${uiRoot}/components/features/editor/index.js`,
      },
      { find: "@packages/ui/hooks", replacement: `${uiRoot}/hooks/index.js` },
      { find: "@packages/ui/utils", replacement: `${uiRoot}/utils/index.js` },
      { find: "@packages/ui/lib", replacement: `${uiRoot}/lib/utils.js` },
      {
        find: "@packages/ui/shadcn",
        replacement: `${uiRoot}/components/shadcn/index.js`,
      },
      {
        find: "@packages/ui/misc",
        replacement: `${uiRoot}/components/misc/index.js`,
      },
      { find: "@packages/ui/config", replacement: `${uiRoot}/config/index.js` },
      {
        find: "@packages/ui/forms",
        replacement: `${uiRoot}/components/forms/index.js`,
      },
      { find: "@packages/ui", replacement: `${uiRoot}/index.js` },
    ],
  },
});
