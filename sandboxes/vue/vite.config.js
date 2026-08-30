import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue({
      template: {
        // Tell Vue's compiler that <scarlet-*> tags are native custom
        // elements (Stencil web components), not unresolved Vue components.
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('scarlet-')
        }
      }
    })
  ],
  server: {
    port: 3001,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
