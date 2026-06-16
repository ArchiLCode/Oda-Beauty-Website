import type { ContentValidationResult, LandingContent, ServiceCategoryId } from './types';

const hasText = (value: string): boolean => value.trim().length > 0;

const hasUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateLandingContent = (content: LandingContent): ContentValidationResult => {
  const errors: string[] = [];
  const categoryIds = new Set<ServiceCategoryId>();

  for (const category of content.services.categories) {
    categoryIds.add(category.id);
    if (!hasText(category.title)) {
      errors.push(`Service category "${category.id}" is missing title.`);
    }
    if (!hasText(category.image.alt)) {
      errors.push(`Service category "${category.id}" is missing image alt text.`);
    }
  }

  const serviceIds = new Set<string>();
  for (const service of content.services.items) {
    if (serviceIds.has(service.id)) {
      errors.push(`Service "${service.title}" has a duplicate id "${service.id}".`);
    }
    serviceIds.add(service.id);
    if (!categoryIds.has(service.categoryId)) {
      errors.push(`Service "${service.title}" references unknown category "${service.categoryId}".`);
    }
    if (!hasText(service.title)) {
      errors.push(`Service "${service.id}" is missing title.`);
    }
    if (!hasText(service.price)) {
      errors.push(`Service "${service.title}" is missing price.`);
    }
    if (!hasText(service.duration)) {
      errors.push(`Service "${service.title}" is missing duration.`);
    }
    if (!hasUrl(service.bookingUrl)) {
      errors.push(`Service "${service.title}" is missing bookingUrl.`);
    }
    if (!hasText(service.image.alt)) {
      errors.push(`Service "${service.title}" is missing image alt text.`);
    }
  }

  for (const member of content.team) {
    if (!hasText(member.name)) {
      errors.push(`Team member "${member.id}" is missing name.`);
    }
    if (!hasUrl(member.bookingUrl)) {
      errors.push(`Team member "${member.name}" is missing bookingUrl.`);
    }
    if (!hasText(member.image.alt)) {
      errors.push(`Team member "${member.name}" is missing image alt text.`);
    }
  }

  for (const item of content.gallery) {
    if (!hasText(item.image.alt)) {
      errors.push(`Gallery image "${item.id}" is missing alt text.`);
    }
  }

  for (const social of content.socials) {
    if (!hasUrl(social.url)) {
      errors.push(`Social link "${social.label}" is missing url.`);
    }
    if (!hasText(social.icon.alt)) {
      errors.push(`Social link "${social.label}" is missing icon alt text.`);
    }
  }

  if (!hasUrl(content.hero.bookingUrl)) {
    errors.push('Hero is missing bookingUrl.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
