import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  {
    ignores: [
      "**/build/**"
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-else-return": "error",
      "require-await": "error",
      curly: "error",
      "func-style": ["error", "declaration"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "ignoreRestSiblings": true
        }
      ],
    },
  },
  prettier
);