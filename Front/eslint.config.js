import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

const config = [
  js.configs.recommended,
  {
    // ESLint 기본 설정
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-var": "error",
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      eqeqeq: "error",
      "dot-notation": "error",
      "no-unused-vars": "error",
    },
  },
  // Prettier 설정을 추가합니다.
  prettier,
];

export default config;
