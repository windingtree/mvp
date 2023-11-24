import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'packages',
      environment: 'node',
      include: ['./packages/**/*.spec.ts'],
    },
  },
]);
