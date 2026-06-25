import { createClient } from '@sanity/client';
import { mapSanityJobsPageContent, mapSanityLandingContent } from './mapper';
import { jobsContentQuery, landingContentQuery } from './query';
import type { SanityJobsPayload, SanityLandingPayload } from './types';

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

export const getSanityJobsPageContent = async () => {
  const client = createClient({
    projectId: requireEnvironment('SANITY_PROJECT_ID'),
    dataset: process.env.SANITY_DATASET ?? 'production',
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_READ_TOKEN,
    perspective: 'published',
  });

  const payload = await client.fetch<SanityJobsPayload>(jobsContentQuery);
  return mapSanityJobsPageContent(payload);
};
