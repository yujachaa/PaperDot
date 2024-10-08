import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: 20000, // 20KB로 설정
  },
  plugins: [react(), svgr(), tsconfigPaths(), nodePolyfills()],
});
