import { getSanityJobsPageContent, getSanityLandingContent } from './sanity/provider';
import { normalizeSocialLinks } from './social-links';
import { getStaticJobsPageContent, getStaticLandingContent } from './static-provider';
import type { JobsPageContent, LandingContent } from './types';
import { validateJobsPageContent, validateLandingContent } from './validate';

type ContentSource = 'static' | 'sanity';

const getContentSource = (): ContentSource => {
  const source = process.env.CONTENT_SOURCE ?? 'static';

  if (source !== 'static' && source !== 'sanity') {
    throw new Error(`Unsupported CONTENT_SOURCE "${source}". Expected "static" or "sanity".`);
  }

  return source;
};

const assertValidContent = (content: LandingContent): LandingContent => {
  const result = validateLandingContent(content);

  if (!result.valid) {
    throw new Error(`Landing content validation failed:\n- ${result.errors.join('\n- ')}`);
  }

  return content;
};

const assertValidJobsContent = (content: JobsPageContent): JobsPageContent => {
  const result = validateJobsPageContent(content);

  if (!result.valid) {
    throw new Error(`Jobs page content validation failed:\n- ${result.errors.join('\n- ')}`);
  }

  return content;
};

export const getLandingContent = async (): Promise<LandingContent> => {
  const content = getContentSource() === 'sanity'
    ? await getSanityLandingContent()
    : getStaticLandingContent();

  return assertValidContent({
    ...content,
    socials: normalizeSocialLinks(content.socials),
  });
};

export const getJobsPageContent = async (): Promise<JobsPageContent> => {
  const content = getContentSource() === 'sanity'
    ? await getSanityJobsPageContent()
    : getStaticJobsPageContent();

  return assertValidJobsContent(content);
};
