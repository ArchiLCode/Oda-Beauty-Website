import { describe, expect, it } from 'vitest';
import { getLandingContent } from '../src/content/provider';
import { validateLandingContent } from '../src/content/validate';
import type { LandingContent } from '../src/content/types';

describe('landing content provider', () => {
  it('provides complete CMS-ready content for the landing page', async () => {
    const contentPromise = getLandingContent();

    expect(typeof contentPromise.then).toBe('function');

    const content = await contentPromise;
    const result = validateLandingContent(content);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(content.services.categories.map((category) => category.id)).toEqual([
      'manicure',
      'pedicure',
      'brows',
      'lashes',
      'makeup',
      'hair',
      'men',
    ]);
    expect(content.services.items.length).toBeGreaterThan(50);
    expect(content.team.length).toBeGreaterThan(10);
    expect(content.gallery.length).toBeGreaterThan(10);
    expect(content.reviews.items.length).toBeGreaterThanOrEqual(4);
  });

  it('keeps every service connected to a category, image and booking link', async () => {
    const content = await getLandingContent();
    const categoryIds = new Set(content.services.categories.map((category) => category.id));
    const serviceIds = new Set<string>();

    for (const service of content.services.items) {
      expect(serviceIds.has(service.id), `${service.id} must be unique`).toBe(false);
      serviceIds.add(service.id);
      expect(categoryIds.has(service.categoryId), `${service.title} has an unknown category`).toBe(true);
      expect(service.title.trim()).not.toBe('');
      expect(service.price.trim()).not.toBe('');
      expect(service.duration.trim()).not.toBe('');
      expect(service.bookingUrl).toMatch(/^https?:\/\//);
      expect(service.image.src).toMatch(/^\/img\/services\//);
      expect(service.image.alt.trim()).not.toBe('');
    }
  });

  it('reports validation errors for broken required fields', async () => {
    const content = structuredClone(await getLandingContent()) as LandingContent;
    const brokenBrandName = content.brands[0].name;
    content.services.items[0].bookingUrl = '';
    content.gallery[0].image.alt = '';
    content.services.items[1].price = '';
    content.services.items[2].duration = '';
    content.services.items[3].categoryId = 'unknown-category';
    content.brands[0].image.src = '';

    const result = validateLandingContent(content);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Service "Маникюр с покрытием" is missing bookingUrl.');
    expect(result.errors).toContain('Gallery image "gallery-1" is missing alt text.');
    expect(result.errors).toContain('Service "Маникюр + френч" is missing price.');
    expect(result.errors).toContain('Service "Наращивание ногтей" is missing duration.');
    expect(result.errors).toContain('Service "Наращивание + френч" references unknown category "unknown-category".');
    expect(result.errors).toContain(`Brand logo "${brokenBrandName}" is missing image source.`);
  });

  it('reports duplicate ids in every CMS-managed collection', async () => {
    const content = structuredClone(await getLandingContent()) as LandingContent;
    const duplicateBrandId = content.brands[0].id;
    content.services.categories[1].id = content.services.categories[0].id;
    content.team[1].id = content.team[0].id;
    content.gallery[1].id = content.gallery[0].id;
    content.brands[1].id = content.brands[0].id;
    content.reviews.items[1].id = content.reviews.items[0].id;

    const result = validateLandingContent(content);

    expect(result.errors).toContain('Service category has a duplicate id "manicure".');
    expect(result.errors).toContain('Team member has a duplicate id "olga-davydova".');
    expect(result.errors).toContain('Gallery image has a duplicate id "gallery-1".');
    expect(result.errors).toContain(`Brand logo has a duplicate id "${duplicateBrandId}".`);
    expect(result.errors).toContain('Review has a duplicate id "angelina".');
  });

  it('fails fast when the Sanity source is selected without project configuration', async () => {
    const previousSource = process.env.CONTENT_SOURCE;
    const previousProjectId = process.env.SANITY_PROJECT_ID;
    process.env.CONTENT_SOURCE = 'sanity';
    delete process.env.SANITY_PROJECT_ID;

    try {
      await expect(getLandingContent()).rejects.toThrow(
        'SANITY_PROJECT_ID is required when CONTENT_SOURCE=sanity.',
      );
    } finally {
      if (previousSource === undefined) delete process.env.CONTENT_SOURCE;
      else process.env.CONTENT_SOURCE = previousSource;

      if (previousProjectId === undefined) delete process.env.SANITY_PROJECT_ID;
      else process.env.SANITY_PROJECT_ID = previousProjectId;
    }
  });

  it('rejects empty CMS collections', async () => {
    const content = structuredClone(await getLandingContent()) as LandingContent;
    content.services.categories = [];
    content.services.items = [];
    content.team = [];
    content.gallery = [];
    content.brands = [];
    content.reviews.items = [];

    const result = validateLandingContent(content);

    expect(result.errors).toEqual(expect.arrayContaining([
      'At least one service category is required.',
      'At least one service is required.',
      'At least one team member is required.',
      'At least one gallery image is required.',
      'At least one brand logo is required.',
      'At least one review is required.',
    ]));
  });
});
