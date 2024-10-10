import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    build: {
      assetsInlineLimit: 20000, // 20KB로 설정
    },
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),
      nodePolyfills(),
      command === 'build' &&
        removeConsole({
          includes: ['log', 'warn', 'error'],
        }),
    ],
  };
});
