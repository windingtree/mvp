import { defineConfig } from 'tsup';
import { dependencies } from './package.json';

export default defineConfig([
  {
    tsconfig: './tsconfig.json',
    entry: {
      index: './src/index.ts',
      types: './src/types.ts',
    },
    platform: 'node',
    treeshake: true,
    sourcemap: true,
    format: ['esm', 'cjs'],
    external: Object.keys(dependencies),
    splitting: false,
  },
]);
