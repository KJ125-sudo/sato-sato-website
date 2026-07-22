import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5190,
    open: '/',
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger.js', 'lenis'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
