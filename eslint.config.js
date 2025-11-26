import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  {
    ignores: ['dist', 'build', 'node_modules', '*.config.js']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Base JS rules
      ...js.configs.recommended.rules,
      
      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Prettier rules
      'prettier/prettier': 'off',
      
      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      // Custom rules
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_'
      }],
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
    },
  },
]