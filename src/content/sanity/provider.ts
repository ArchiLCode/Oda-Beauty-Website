import { createClient } from '@sanity/client';
import { mapSanityLandingContent } from './mapper';
import { landingContentQuery } from './query';
import type { SanityLandingPayload } from './types';

const apiVersion = '2026-06-18';

const requireEnvironment = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required when CONTENT_SOURCE=sanity.`);
  }

  return value;
};

export const getSanityLandingContent = async () => {
  const client = createClient({
    projectId: requireEnvironment('SANITY_PROJECT_ID'),
    dataset: process.env.SANITY_DATASET ?? 'production',
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_READ_TOKEN,
    perspective: 'published',
  });

  const payload = await client.fetch<SanityLandingPayload>(landingContentQuery);
  return mapSanityLandingContent(payload);
};
