import { describe, expect, it } from 'vitest';
import { getLandingContent } from '../src/content/provider';
import { validateLandingContent } from '../src/content/validate';
import type { LandingContent } from '../src/content/types';

describe('landing content provider', () => {
  it('provides complete CMS-ready content for the landing page', () => {
    const content = getLandingContent();
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

  it('keeps every service connected to a category, image and booking link', () => {
    const content = getLandingContent();
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

  it('reports validation errors for broken required fields', () => {
    const content = structuredClone(getLandingContent()) as LandingContent;
    content.services.items[0].bookingUrl = '';
    content.gallery[0].image.alt = '';

    const result = validateLandingContent(content);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Service "Маникюр с покрытием" is missing bookingUrl.');
    expect(result.errors).toContain('Gallery image "gallery-1" is missing alt text.');
  });
});
