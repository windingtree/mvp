import { defineConfig } from 'vite';
import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: true, mute: true }),
    nodePolyfills({ include: ['path', 'url'] }),
    react(),
  ],
});
