import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['dist', '**/*.mjs', '**/*.config.js'] },
  tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat['jsx-runtime'],
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { ecmaVersion: 2022 },
    rules: { semi: 'error', '@typescript-eslint/no-unused-vars': 'warn' },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: { 'no-unused-vars': 'off' },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
