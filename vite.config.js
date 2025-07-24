import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api-nelmara-ribeiro.site',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});