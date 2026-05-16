import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const port = 3001;

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
				find: "@packages/ui",
				replacement: path.resolve(__dirname, "../../packages/ui/src"),
			},
		],
	},
});
