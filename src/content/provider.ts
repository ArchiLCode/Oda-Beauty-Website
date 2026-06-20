import { getSanityLandingContent } from './sanity/provider';
import { normalizeSocialLinks } from './social-links';
import { getStaticLandingContent } from './static-provider';
import type { LandingContent } from './types';
import { validateLandingContent } from './validate';

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

export const getLandingContent = async (): Promise<LandingContent> => {
  const content = getContentSource() === 'sanity'
    ? await getSanityLandingContent()
    : getStaticLandingContent();

  return assertValidContent({
    ...content,
    socials: normalizeSocialLinks(content.socials),
  });
};
