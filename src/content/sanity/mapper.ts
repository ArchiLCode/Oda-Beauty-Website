import type { ImageRef, JobsBenefit, JobsPageContent, LandingContent } from '../types';
import type { SanityImage, SanityJobsPayload, SanityLandingPayload } from './types';

const mapImage = (image: SanityImage): ImageRef => ({
  src: image.url,
  alt: image.alt,
});

export const mapSanityLandingContent = (payload: SanityLandingPayload): LandingContent => {
  if (!payload.landing) {
    throw new Error('Sanity landingPage document was not found.');
  }

  const landing = payload.landing;

  return {
    seo: landing.seo,
    nav: landing.nav,
    contacts: landing.contacts,
    socials: landing.socials,
    brands: payload.brands.map(({ id, name, image }) => ({ id, name, image: mapImage(image) })),
    hero: {
      ...landing.hero,
      desktopImage: mapImage(landing.hero.desktopImage),
      mobileImage: mapImage(landing.hero.mobileImage),
    },
    about: {
      ...landing.about,
      image: mapImage(landing.about.image),
    },
    services: {
      categories: payload.categories.map(({ id, title, image }) => ({
        id,
        title,
        image: mapImage(image),
      })),
      items: payload.services.map(({ order: _order, image, ...service }) => ({
        ...service,
        image: mapImage(image),
      })),
    },
    team: payload.team.map(({ order: _order, image, ...member }) => ({
      ...member,
      image: mapImage(image),
    })),
    gallery: payload.gallery.map(({ id, image }) => ({ id, image: mapImage(image) })),
    reviews: {
      ...landing.reviews,
      items: payload.reviews.map(({ order: _order, ...review }) => review),
    },
  };
};

const mapBenefit = ({ order: _order, ...benefit }: JobsBenefit & { order?: number }): JobsBenefit => benefit;

export const mapSanityJobsPageContent = (payload: SanityJobsPayload): JobsPageContent => {
  if (!payload.page) {
    throw new Error('Sanity jobsPage document was not found.');
  }

  const page = payload.page;

  return {
    page: {
      seo: page.seo,
      hero: {
        ...page.hero,
        image: mapImage(page.hero.image),
      },
      benefits: page.benefits.map(mapBenefit),
      workBenefits: page.workBenefits.map(mapBenefit),
      resumeCta: {
        ...page.resumeCta,
        image: mapImage(page.resumeCta.image),
      },
    },
    vacancies: payload.vacancies.map(({ order: _order, image, ...vacancy }) => ({
      ...vacancy,
      image: mapImage(image),
    })),
  };
};
