import type { ContactInfo, ImageRef, SeoContent } from '../types';

export interface SanityImage {
  url: string;
  alt: string;
}

export interface OrderedDocument {
  order?: number;
}

export interface SanityLandingDocument {
  seo: SeoContent;
  nav: Array<{ label: string; href: string }>;
  contacts: ContactInfo;
  socials: Array<{
    id: string;
    label: string;
    url: string;
    icon: ImageRef;
  }>;
  hero: {
    brand: string;
    subtitle: string;
    services: string[];
    bookingUrl: string;
    desktopImage: SanityImage;
    mobileImage: SanityImage;
  };
  about: {
    title: string;
    text: string[];
    image: SanityImage;
  };
  reviews: {
    rating: number;
    count: string;
    externalUrl: string;
  };
}

export interface SanityLandingPayload {
  landing: SanityLandingDocument | null;
  categories: Array<OrderedDocument & {
    id: string;
    title: string;
    image: SanityImage;
  }>;
  services: Array<OrderedDocument & {
    id: string;
    categoryId: string;
    title: string;
    price: string;
    duration: string;
    bookingUrl: string;
    image: SanityImage;
    featured?: boolean;
  }>;
  team: Array<OrderedDocument & {
    id: string;
    name: string;
    role: string;
    bookingUrl: string;
    image: SanityImage;
  }>;
  gallery: Array<OrderedDocument & {
    id: string;
    image: SanityImage;
  }>;
  brands: Array<OrderedDocument & {
    id: string;
    name: string;
    image: SanityImage;
  }>;
  reviews: Array<OrderedDocument & {
    id: string;
    author: string;
    rating: number;
    text: string;
  }>;
}
