import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5180,
    open: false,
    cors: true
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
