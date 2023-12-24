import { defineConfig } from 'tsup';
import { dependencies } from './package.json';

export default defineConfig([
  {
    tsconfig: './tsconfig.json',
    entry: {
      index: './src/index.ts',
    },
    platform: 'node',
    treeshake: true,
    sourcemap: true,
    format: ['esm'],
    external: Object.keys(dependencies),
    splitting: false,
  },
]);
