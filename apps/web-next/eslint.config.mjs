import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import rootConfig from "../../eslint.config.mjs";

const stripTsPlugin = (configs) =>
	configs.map(({ plugins, ...config }) => {
		if (plugins?.["@typescript-eslint"]) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { "@typescript-eslint": _, ...rest } = plugins;
			return {
				...config,
				...(Object.keys(rest).length ? { plugins: rest } : {}),
			};
		}
		return { ...config, ...(plugins ? { plugins } : {}) };
	});

const eslintConfig = defineConfig([
	...rootConfig,
	...stripTsPlugin(nextVitals),
	...stripTsPlugin(nextTs),
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
