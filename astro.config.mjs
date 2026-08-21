import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lsbjordao.github.io',
  base: '/consultoria-astro-webgl',
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      target: 'es2022'
    }
  }
});
