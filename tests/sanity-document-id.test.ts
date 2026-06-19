import { describe, expect, it } from 'vitest';
import { toSanityDocumentId } from '../scripts/sanity-id';

describe('Sanity document ids', () => {
  it('creates stable ASCII ids for Cyrillic content identifiers', () => {
    const first = toSanityDocumentId('service', 'manicure-маникюр-с-покрытием');
    const second = toSanityDocumentId('service', 'manicure-маникюр-с-покрытием');
    const different = toSanityDocumentId('service', 'manicure-маникюр-без-покрытия');

    expect(first).toBe(second);
    expect(first).not.toBe(different);
    expect(first).toMatch(/^[A-Za-z0-9._-]+$/);
    expect(first.length).toBeLessThanOrEqual(100);
  });
});
