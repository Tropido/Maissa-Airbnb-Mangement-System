import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Next.js 16 removed `next lint`; the ESLint CLI runs this flat config instead
 * (see node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md).
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Design reference package: prototype HTML and its editor runtime, not app code.
    'Maissa Redesign/**',
  ]),
]);

export default eslintConfig;
