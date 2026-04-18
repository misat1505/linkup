const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: path.resolve(),
    project: ["./tsconfig.json"],
  },
};
