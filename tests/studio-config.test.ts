import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Sanity Studio configuration', () => {
  it('uses browser-safe Studio environment variables', () => {
    const source = readFileSync('studio/sanity.config.ts', 'utf8');

    expect(source).not.toContain("import 'dotenv/config'");
    expect(source).toContain('process.env.SANITY_STUDIO_PROJECT_ID');
    expect(source).toContain('process.env.SANITY_STUDIO_DATASET');
  });
});
