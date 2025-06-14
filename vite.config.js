//vite.config.js

export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api-nelmara-ribeiro.site',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};