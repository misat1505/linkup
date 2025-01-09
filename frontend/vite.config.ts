import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    https: {
      key: fs.readFileSync("config/security/key.pem"),
      cert: fs.readFileSync("config/security/cert.crt"),
    },
  },
  preview: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
