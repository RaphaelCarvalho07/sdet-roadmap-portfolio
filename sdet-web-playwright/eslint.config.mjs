import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    plugins: {
      playwright,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/prefer-lowercase-title': 'warn',
    },
  },
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/'],
  }
);