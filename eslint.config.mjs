import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: ['build/**', 'dist/**'],
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['src/**/*.{ts,mts,cts}'],
        extends: tseslint.configs.recommended,
    },
]);
