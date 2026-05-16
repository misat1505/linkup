import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import ts from "typescript-eslint";

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	{
		rules: {
			"no-console": ["warn", { allow: ["warn", "error", "info", "debug"] }],
		},
	},
	prettier,
];
