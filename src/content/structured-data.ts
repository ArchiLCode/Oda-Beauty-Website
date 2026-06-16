import type { LandingContent } from './types';

export const createBeautySalonJsonLd = (content: LandingContent) => ({
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'ODa Beauty Salon',
  image: `${content.seo.canonicalUrl.replace(/\/$/, '')}${content.hero.desktopImage.src}`,
  url: content.seo.canonicalUrl,
  telephone: content.contacts.phone,
  priceRange: '₽₽',
  address: {
    '@type': 'PostalAddress',
    addressLocality: content.contacts.city,
    streetAddress: content.contacts.address,
    addressCountry: 'RU',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '21:00',
    },
  ],
  sameAs: content.socials.map((social) => social.url),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: content.reviews.rating,
    reviewCount: 201,
    bestRating: 5,
  },
});
