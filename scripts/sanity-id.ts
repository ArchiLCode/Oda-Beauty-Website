import { createHash } from 'node:crypto';

const asciiSegment = (value: string, maxLength: number): string =>
  value
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength);

export const toSanityDocumentId = (documentType: string, contentId: string): string => {
  const typeSegment = asciiSegment(documentType, 20) || 'document';
  const contentSegment = asciiSegment(contentId, 60) || 'item';
  const digest = createHash('sha256').update(`${documentType}:${contentId}`).digest('hex').slice(0, 12);

  return `${typeSegment}-${contentSegment}-${digest}`;
};
