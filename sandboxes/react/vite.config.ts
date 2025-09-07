import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
