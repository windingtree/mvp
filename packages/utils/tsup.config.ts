import { defineConfig } from 'tsup';
import { dependencies } from './package.json';

export default defineConfig([
  {
    tsconfig: './tsconfig.json',
    dts: false,
    entry: {
      repair: './src/repair.js',
    },
    platform: 'node',
    treeshake: true,
    sourcemap: false,
    splitting: false,
    clean: true,
    format: ['cjs'],
    external: Object.keys(dependencies),
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
