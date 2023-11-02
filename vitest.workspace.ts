import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'packages:node',
      environment: 'node',
      include: ['./packages/**/*.spec.ts'],
    },
  },
]);
