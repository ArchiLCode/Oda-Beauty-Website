import 'dotenv/config';
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';

export default defineConfig({
  site: 'https://oda-beauty.ru',
  integrations: projectId
    ? [
        sanity({
          projectId,
          dataset,
          apiVersion: '2026-06-18',
          useCdn: false,
        }),
      ]
    : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
