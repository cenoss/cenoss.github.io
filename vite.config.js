import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// base './': the build works from any folder, including a GitHub Pages project path
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: { assetsDir: 'app' },   // keeps Vite's bundle apart from the kit's public/assets
  server: { port: 5173 },
});
