import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3004,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
