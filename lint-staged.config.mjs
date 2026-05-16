export default {
	"apps/web-react/**/*.{js,jsx,ts,tsx}": [() => "pnpm --filter web-react lint", "prettier --write"],
	"apps/web-next/**/*.{js,jsx,ts,tsx}": [() => "pnpm --filter web-next lint", "prettier --write"],
	"apps/backend/**/*.{js,ts}": [() => "pnpm --filter backend lint", "prettier --write"],
	"apps/websocket/**/*.{js,ts}": [() => "pnpm --filter websocket lint", "prettier --write"],
	"packages/**/*.{js,ts,tsx}": [() => "pnpm -r --filter './packages/**' lint", "prettier --write"],
	"**/*.{json,md,yaml,yml,css}": ["prettier --write"],
};
