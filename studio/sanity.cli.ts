import 'dotenv/config';
import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required for Sanity CLI commands.');
}

const dataset = process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? 'production';

// Studio bundles only SANITY_STUDIO_* variables. Mirror the server-side values before Vite starts.
if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  process.env.SANITY_STUDIO_PROJECT_ID = projectId;
}
if (!process.env.SANITY_STUDIO_DATASET) {
  process.env.SANITY_STUDIO_DATASET = dataset;
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
