// eslint.config.mjs
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Carpetas a ignorar por eslint
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'jest.config.js',
      'tailwind.config.js',
      'postcss.config.mjs',
      'next-env.d.ts',
      '.vscode/**',
    ],
  },

  // Reglas base de JavaScript
  js.configs.recommended,

  // Reglas de TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // Reglas de Next.js
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Reglas opcionales que podés modificar
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  // Override para Jest
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    env: {
      jest: true, // activa globals de Jest (describe, it, expect)
    },
  },

  // Prettier
  {
    plugins: {
      prettier: prettierConfig,
    },
    rules: {
      ...prettierConfig.rules,
    },
  },

  // Reglas globales de React / ajustes manuales
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
