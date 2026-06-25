import type { ContentValidationResult, JobsPageContent, LandingContent, ServiceCategoryId } from './types';

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

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

  if (content.services.categories.length === 0) {
    errors.push('At least one service category is required.');
  }
  if (content.services.items.length === 0) {
    errors.push('At least one service is required.');
  }
  if (content.team.length === 0) {
    errors.push('At least one team member is required.');
  }
  if (content.gallery.length === 0) {
    errors.push('At least one gallery image is required.');
  }
  if (content.brands.length === 0) {
    errors.push('At least one brand logo is required.');
  }
  if (content.reviews.items.length === 0) {
    errors.push('At least one review is required.');
  }

  const categoryIds = new Set<ServiceCategoryId>();

  for (const category of content.services.categories) {
    if (categoryIds.has(category.id)) {
      errors.push(`Service category has a duplicate id "${category.id}".`);
    }
    categoryIds.add(category.id);
    if (!hasText(category.title)) {
      errors.push(`Service category "${category.id}" is missing title.`);
    }
    if (!hasText(category.image?.src)) {
      errors.push(`Service category "${category.id}" is missing image source.`);
    }
    if (!hasText(category.image?.alt)) {
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
    if (!hasText(service.image?.src)) {
      errors.push(`Service "${service.title}" is missing image source.`);
    }
    if (!hasText(service.image?.alt)) {
      errors.push(`Service "${service.title}" is missing image alt text.`);
    }
  }

  const teamIds = new Set<string>();
  for (const member of content.team) {
    if (teamIds.has(member.id)) {
      errors.push(`Team member has a duplicate id "${member.id}".`);
    }
    teamIds.add(member.id);
    if (!hasText(member.name)) {
      errors.push(`Team member "${member.id}" is missing name.`);
    }
    if (!hasUrl(member.bookingUrl)) {
      errors.push(`Team member "${member.name}" is missing bookingUrl.`);
    }
    if (!hasText(member.image?.src)) {
      errors.push(`Team member "${member.name}" is missing image source.`);
    }
    if (!hasText(member.image?.alt)) {
      errors.push(`Team member "${member.name}" is missing image alt text.`);
    }
  }

  const galleryIds = new Set<string>();
  for (const item of content.gallery) {
    if (galleryIds.has(item.id)) {
      errors.push(`Gallery image has a duplicate id "${item.id}".`);
    }
    galleryIds.add(item.id);
    if (!hasText(item.image?.src)) {
      errors.push(`Gallery image "${item.id}" is missing source.`);
    }
    if (!hasText(item.image?.alt)) {
      errors.push(`Gallery image "${item.id}" is missing alt text.`);
    }
  }

  const brandIds = new Set<string>();
  for (const brand of content.brands) {
    if (brandIds.has(brand.id)) {
      errors.push(`Brand logo has a duplicate id "${brand.id}".`);
    }
    brandIds.add(brand.id);
    if (!hasText(brand.image?.src)) {
      errors.push(`Brand logo "${brand.name}" is missing image source.`);
    }
    if (!hasText(brand.image?.alt)) {
      errors.push(`Brand logo "${brand.name}" is missing image alt text.`);
    }
  }

  const reviewIds = new Set<string>();
  for (const review of content.reviews.items) {
    if (reviewIds.has(review.id)) {
      errors.push(`Review has a duplicate id "${review.id}".`);
    }
    reviewIds.add(review.id);
  }

  for (const social of content.socials) {
    if (!hasUrl(social.url)) {
      errors.push(`Social link "${social.label}" is missing url.`);
    }
    if (social.icon && !hasText(social.icon.src)) {
      errors.push(`Social link "${social.label}" is missing icon source.`);
    }
    if (social.icon && !hasText(social.icon.alt)) {
      errors.push(`Social link "${social.label}" is missing icon alt text.`);
    }
  }

  if (!hasUrl(content.hero.bookingUrl)) {
    errors.push('Hero is missing bookingUrl.');
  }
  if (!hasText(content.hero.desktopImage?.src) || !hasText(content.hero.desktopImage?.alt)) {
    errors.push('Hero desktop image is incomplete.');
  }
  if (!hasText(content.hero.mobileImage?.src) || !hasText(content.hero.mobileImage?.alt)) {
    errors.push('Hero mobile image is incomplete.');
  }
  if (!hasText(content.about.image?.src) || !hasText(content.about.image?.alt)) {
    errors.push('About image is incomplete.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateJobsPageContent = (content: JobsPageContent): ContentValidationResult => {
  const errors: string[] = [];

  if (!hasText(content.page.seo?.title)) {
    errors.push('Jobs SEO is missing title.');
  }
  if (!hasText(content.page.seo?.description)) {
    errors.push('Jobs SEO is missing description.');
  }
  if (!hasUrl(content.page.seo?.canonicalUrl)) {
    errors.push('Jobs SEO is missing canonicalUrl.');
  }
  if (!hasText(content.page.hero?.title)) {
    errors.push('Jobs hero is missing title.');
  }
  if (!hasText(content.page.hero?.text)) {
    errors.push('Jobs hero is missing text.');
  }
  if (!hasText(content.page.hero?.ctaLabel)) {
    errors.push('Jobs hero is missing ctaLabel.');
  }
  if (!hasText(content.page.hero?.ctaUrl)) {
    errors.push('Jobs hero is missing ctaUrl.');
  }
  if (!hasText(content.page.hero?.image?.src)) {
    errors.push('Jobs hero is missing image source.');
  }
  if (!hasText(content.page.hero?.image?.alt)) {
    errors.push('Jobs hero is missing image alt text.');
  }

  content.page.benefits.forEach((benefit, index) => {
    if (!hasText(benefit.id)) {
      errors.push(`Jobs benefit "${index}" is missing id.`);
    }
    if (!hasText(benefit.label)) {
      errors.push(`Jobs benefit "${index}" is missing label.`);
    }
    if (!hasText(benefit.text)) {
      errors.push(`Jobs benefit "${benefit.id || index}" is missing text.`);
    }
    if (!hasText(benefit.icon)) {
      errors.push(`Jobs benefit "${benefit.id || index}" is missing icon.`);
    }
  });

  content.page.workBenefits.forEach((benefit, index) => {
    if (!hasText(benefit.id)) {
      errors.push(`Jobs work benefit "${index}" is missing id.`);
    }
    if (!hasText(benefit.label)) {
      errors.push(`Jobs work benefit "${index}" is missing label.`);
    }
    if (!hasText(benefit.text)) {
      errors.push(`Jobs work benefit "${benefit.id || index}" is missing text.`);
    }
    if (!hasText(benefit.icon)) {
      errors.push(`Jobs work benefit "${benefit.id || index}" is missing icon.`);
    }
  });

  if (!hasText(content.page.resumeCta?.title)) {
    errors.push('Jobs resume CTA is missing title.');
  }
  if (!hasText(content.page.resumeCta?.text)) {
    errors.push('Jobs resume CTA is missing text.');
  }
  if (!hasText(content.page.resumeCta?.buttonLabel)) {
    errors.push('Jobs resume CTA is missing buttonLabel.');
  }
  if (!hasUrl(content.page.resumeCta?.url)) {
    errors.push('Jobs resume CTA is missing url.');
  }
  if (!hasText(content.page.resumeCta?.image?.src)) {
    errors.push('Jobs resume CTA is missing image source.');
  }
  if (!hasText(content.page.resumeCta?.image?.alt)) {
    errors.push('Jobs resume CTA is missing image alt text.');
  }

  const vacancyIds = new Set<string>();
  for (const vacancy of content.vacancies) {
    if (vacancyIds.has(vacancy.id)) {
      errors.push(`Vacancy has a duplicate id "${vacancy.id}".`);
    }
    vacancyIds.add(vacancy.id);

    if (!hasText(vacancy.title)) {
      errors.push(`Vacancy "${vacancy.id}" is missing title.`);
    }
    if (!hasText(vacancy.salary)) {
      errors.push(`Vacancy "${vacancy.title}" is missing salary.`);
    }
    if (!hasText(vacancy.experience)) {
      errors.push(`Vacancy "${vacancy.title}" is missing experience.`);
    }
    if (vacancy.requirements.length === 0) {
      errors.push(`Vacancy "${vacancy.title}" must have at least one requirement.`);
    }
    vacancy.requirements.forEach((requirement, index) => {
      if (!hasText(requirement)) {
        errors.push(`Vacancy "${vacancy.title}" has an empty requirement at index ${index}.`);
      }
    });
    if (!hasUrl(vacancy.applicationUrl)) {
      errors.push(`Vacancy "${vacancy.title}" is missing applicationUrl.`);
    }
    if (!hasText(vacancy.buttonLabel)) {
      errors.push(`Vacancy "${vacancy.title}" is missing buttonLabel.`);
    }
    if (!hasText(vacancy.image?.src)) {
      errors.push(`Vacancy "${vacancy.title}" is missing image source.`);
    }
    if (!hasText(vacancy.image?.alt)) {
      errors.push(`Vacancy "${vacancy.title}" is missing image alt text.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
