import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,

  // 🔥 Ignore build / generated files
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    '.github/**',
  ]),

  // 🌍 Production code rules
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // ✅ clean unused vars handling
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // ⚠️ Next.js img rule (disabled to avoid noise)
      '@next/next/no-img-element': 'off',
    },
  },

  // 🧪 Test / scripts = fully relaxed
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      'scripts/**/*.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
]);