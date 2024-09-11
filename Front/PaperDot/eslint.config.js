import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    languageOptions: { 
      globals: globals.browser 
    } 
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    "extends": ["react-app", "eslint:recommended", "prettier"],
    "rules": {
      "no-var": "error", // var 금지
      "no-console": ["error", { "allow": ["warn", "error", "info"] }], // console.log() 금지
      "eqeqeq": "error", // 일치 연산자 사용 필수
      "dot-notation": "error", // 가능하다면 dot notation 사용
      "no-unused-vars": "error" // 사용하지 않는 변수 금지
    }
  }
];
