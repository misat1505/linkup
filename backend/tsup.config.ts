import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  outDir: "build",
  target: "node18",
  format: ["cjs"],
  shims: true,
  clean: true,
  dts: false,
  sourcemap: false,
  alias: {
    "@": "./src",
  },
});
