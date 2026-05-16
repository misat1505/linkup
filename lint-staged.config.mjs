const prettierWrite = (filenames) => {
	const chunks = [];
	const chunkSize = 10;
	for (let i = 0; i < filenames.length; i += chunkSize) {
		chunks.push(
			`prettier --write ${filenames
				.slice(i, i + chunkSize)
				.map((f) => `"${f}"`)
				.join(" ")}`,
		);
	}
	return chunks;
};

export default {
	"apps/web-react/**/*.{js,jsx,ts,tsx}": [() => "pnpm --filter web-react lint", prettierWrite],
	"apps/web-next/**/*.{js,jsx,ts,tsx}": [() => "pnpm --filter web-next lint", prettierWrite],
	"apps/backend/**/*.{js,ts}": [() => "pnpm --filter backend lint", prettierWrite],
	"apps/websocket/**/*.{js,ts}": [() => "pnpm --filter websocket lint", prettierWrite],
	"packages/**/*.{js,ts,tsx}": [() => "pnpm -r --filter './packages/**' lint", prettierWrite],
	"**/*.{json,md,yaml,yml,css}": [prettierWrite],
};
