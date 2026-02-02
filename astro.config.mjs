import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  site: 'https://business.zelify.com',
  output: 'static',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
