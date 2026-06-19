import { describe, expect, it } from 'vitest';
import { mapSanityLandingContent } from '../src/content/sanity/mapper';
import type { SanityLandingPayload } from '../src/content/sanity/types';
import { validateLandingContent } from '../src/content/validate';

const image = (name: string, alt: string) => ({
  url: `https://cdn.sanity.io/images/project/production/${name}.jpg`,
  alt,
});

const payload: SanityLandingPayload = {
  landing: {
    seo: {
      title: 'ODa Beauty',
      description: 'Beauty salon in Smolensk',
      canonicalUrl: 'https://oda-beauty.ru/',
      keywords: ['ODa', 'beauty'],
    },
    nav: [{ label: 'Услуги', href: '#services' }],
    contacts: {
      phone: '+7 (915) 639-89-88',
      phoneHref: 'tel:+79156398988',
      city: 'Смоленск',
      address: 'ул. Багратиона 7',
      mapUrl: 'https://yandex.ru/maps/-/CDfBIEnF',
      mapEmbedUrl: 'https://yandex.ru/map-widget/v1/?um=constructor&source=constructor',
      hours: 'Ежедневно, с 10:00 до 21:00',
    },
    socials: [
      {
        id: 'vk',
        label: 'VK',
        url: 'https://vk.com/oda_beauty_salon',
        icon: { src: '/img/vk.svg', alt: 'VK' },
      },
    ],
    hero: {
      brand: 'ODa',
      subtitle: 'Beauty Salon',
      services: ['Маникюр', 'Волосы'],
      bookingUrl: 'https://beauty.dikidi.net/#widget=161842',
      desktopImage: image('hero-desktop', 'Интерьер салона'),
      mobileImage: image('hero-mobile', 'Интерьер салона на мобильном'),
    },
    about: {
      title: 'О нас',
      text: ['Первый абзац', 'Второй абзац'],
      image: image('about', 'Зал салона'),
    },
    reviews: {
      rating: 5,
      count: '201 отзыв',
      externalUrl: 'https://dikidi.ru/1097816?p=1.pi-pr',
    },
  },
  brands: [
    {
      id: 'emi',
      name: 'EMI',
      image: image('emi', 'EMI'),
      order: 10,
    },
  ],
  categories: [
    {
      id: 'manicure',
      title: 'Маникюр',
      image: image('manicure-category', 'Маникюр ODa Beauty'),
      order: 10,
    },
  ],
  services: [
    {
      id: 'manicure-cover',
      categoryId: 'manicure',
      title: 'Маникюр с покрытием',
      price: 'от 1600 ₽',
      duration: '2 ч',
      bookingUrl: 'https://dkd.su/1097816/s/10677855',
      image: image('manicure-service', 'Маникюр с покрытием'),
      featured: true,
      order: 10,
    },
  ],
  team: [
    {
      id: 'olga-davydova',
      name: 'Ольга Давыдова',
      role: 'Руководитель, топ мастер',
      bookingUrl: 'https://dikidi.ru/1097816?p=1.pi-mi&o=11&m=2827528',
      image: image('olga', 'Ольга Давыдова'),
      order: 10,
    },
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: image('gallery-1', 'Работа ODa Beauty'),
      order: 10,
    },
  ],
  reviews: [
    {
      id: 'angelina',
      author: 'Ангелина',
      rating: 5,
      text: 'Сервис на высочайшем уровне.',
      order: 10,
    },
  ],
};

describe('Sanity landing mapper', () => {
  it('maps Sanity documents into the existing landing content contract', () => {
    const content = mapSanityLandingContent(payload);
    const result = validateLandingContent(content);

    expect(result.errors).toEqual([]);
    expect(content.hero.desktopImage.src).toBe('https://cdn.sanity.io/images/project/production/hero-desktop.jpg');
    expect(content.hero.desktopImage.alt).toBe('Интерьер салона');
    expect(content.services.categories[0].id).toBe('manicure');
    expect(content.services.items[0]).toMatchObject({
      id: 'manicure-cover',
      categoryId: 'manicure',
      title: 'Маникюр с покрытием',
      price: 'от 1600 ₽',
      duration: '2 ч',
      featured: true,
    });
    expect(content.team[0].image.src).toContain('/olga.jpg');
    expect(content.gallery[0].image.alt).toBe('Работа ODa Beauty');
    expect(content.reviews.items[0].author).toBe('Ангелина');
    expect(content.brands[0].image.src).toContain('/emi.jpg');
  });

  it('fails fast when the landing singleton is missing', () => {
    expect(() => mapSanityLandingContent({ ...payload, landing: null })).toThrow(
      'Sanity landingPage document was not found.',
    );
  });
});
