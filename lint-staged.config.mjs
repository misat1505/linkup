export default {
  "apps/web-react/**/*.{js,jsx,ts,tsx}": () => "pnpm --filter web-react lint",
  "apps/web-next/**/*.{js,jsx,ts,tsx}": () => "pnpm --filter web-next lint",
  "apps/backend/**/*.{js,ts}": () => "pnpm --filter backend lint",
  "apps/websocket/**/*.{js,ts}": () => "pnpm --filter websocket lint",
  "packages/**/*.{js,ts,tsx}": () => "pnpm -r --filter './packages/**' lint",
};
