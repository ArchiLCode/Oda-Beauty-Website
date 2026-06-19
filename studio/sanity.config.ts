import 'dotenv/config';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required to run Sanity Studio.');
}

export default defineConfig({
  name: 'oda-beauty',
  title: 'ODa Beauty',
  projectId,
  dataset: process.env.SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2026-06-18' }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previous, context) =>
      context.schemaType === 'landingPage'
        ? previous.filter(({ action }) => action !== 'delete' && action !== 'duplicate')
        : previous,
    newDocumentOptions: (previous) =>
      previous.filter(({ templateId }) => templateId !== 'landingPage'),
  },
});
