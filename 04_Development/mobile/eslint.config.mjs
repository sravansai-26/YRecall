import expo from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'coverage/'],
  },
  ...expo,
  eslintConfigPrettier,
  {
    rules: {
      'import/no-unresolved': 'off',
    },
  },
);
