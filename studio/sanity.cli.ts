import 'dotenv/config';
import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required for Sanity CLI commands.');
}

export default defineCliConfig({
  api: {
    projectId,
    dataset: process.env.SANITY_DATASET ?? 'production',
  },
});
