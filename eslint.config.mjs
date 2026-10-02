import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    files: ["packages/**/*.{ts,tsx}", "vitest.config.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: ["packages/client/src/**/*.{ts,tsx}"],
  },
  {
    files: ["packages/client/src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: [
      "packages/{server,shared}/src/**/*.ts",
      "packages/server/tests/**/*.ts",
      "vitest.config.ts",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
);