import { defineConfig } from 'eslint/config';
import github from 'eslint-plugin-github';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['lib/', 'dist/', 'node_modules/', 'coverage/'],
  },
  github.getFlatConfigs().recommended,
  tseslint.configs.recommended,
  unicorn.configs['recommended'],
  prettier,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        projectService: true,
      },
    },
    rules: {
      // Error out for code formatting errors
      'prettier/prettier': 'error',

      // Namespaces are sometimes needed
      'import/no-namespace': 'off',

      // Properly format comments
      'spaced-comment': ['error', 'always'],
      'lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          beforeLineComment: true,
          allowBlockStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
          allowClassStart: true,
          ignorePattern: 'pragma|ts-ignore',
        },
      ],

      // Mandatory spacing
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
      ],

      // Enforce camelCase
      camelcase: 'error',

      // Allow forOfStatements
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

      // Continue is viable in forOf loops in generators
      'no-continue': 'off',

      // From experience, named exports are almost always desired
      'import/prefer-default-export': 'off',

      // Unused vars are useful to keep method signatures consistent and documented
      '@typescript-eslint/no-unused-vars': 'off',

      // For this project only use kebab-case
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],

      // Allow Array.from(set) mitigate TS2569
      'unicorn/prefer-spread': 'off',

      // CJS output for GitHub Actions doesn't support top-level await
      'unicorn/prefer-top-level-await': 'off',

      // Temp disable to prevent mixing changes with other PRs
      'i18n-text/no-en': 'off',
    },
  },
]);
