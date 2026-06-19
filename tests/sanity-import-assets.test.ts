import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getStaticLandingContent } from '../src/content/static-provider';

describe('Sanity import assets', () => {
  it('keeps every CMS-managed local image available for the initial import', () => {
    const content = getStaticLandingContent();
    const images = [
      content.hero.desktopImage,
      content.hero.mobileImage,
      content.about.image,
      ...content.services.categories.map(({ image }) => image),
      ...content.services.items.map(({ image }) => image),
      ...content.team.map(({ image }) => image),
      ...content.gallery.map(({ image }) => image),
      ...content.brands.map(({ image }) => image),
    ];
    const paths = [...new Set(images.map(({ src }) => src))];

    for (const path of paths) {
      expect(existsSync(resolve('public', `.${path}`)), `${path} must exist`).toBe(true);
    }
  });
});
