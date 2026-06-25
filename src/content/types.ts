export type ServiceCategoryId = string;

export interface ImageRef {
  src: string;
  alt: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: ImageRef;
}

export interface BrandLogo {
  id: string;
  name: string;
  image: ImageRef;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  image: ImageRef;
}

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryId;
  title: string;
  price: string;
  duration: string;
  bookingUrl: string;
  image: ImageRef;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bookingUrl: string;
  image: ImageRef;
}

export interface GalleryImage {
  id: string;
  image: ImageRef;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  city: string;
  address: string;
  mapUrl: string;
  mapEmbedUrl: string;
  hours: string;
}

export interface SeoContent {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
}

export interface JobsBenefit {
  id: string;
  label: string;
  text: string;
  icon: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  salary: string;
  experience: string;
  requirements: string[];
  applicationUrl: string;
  buttonLabel: string;
  image: ImageRef;
  order?: number;
  published?: boolean;
}

export interface JobsPageContent {
  page: {
    seo: SeoContent;
    hero: {
      title: string;
      text: string;
      ctaLabel: string;
      ctaUrl: string;
      image: ImageRef;
    };
    benefits: JobsBenefit[];
    workBenefits: JobsBenefit[];
    resumeCta: {
      title: string;
      text: string;
      buttonLabel: string;
      url: string;
      image: ImageRef;
    };
  };
  vacancies: JobVacancy[];
}

export interface LandingContent {
  seo: SeoContent;
  nav: Array<{ label: string; href: string }>;
  contacts: ContactInfo;
  socials: SocialLink[];
  brands: BrandLogo[];
  hero: {
    brand: string;
    subtitle: string;
    services: string[];
    bookingUrl: string;
    desktopImage: ImageRef;
    mobileImage: ImageRef;
  };
  about: {
    title: string;
    text: string[];
    image: ImageRef;
  };
  services: {
    categories: ServiceCategory[];
    items: ServiceItem[];
  };
  team: TeamMember[];
  gallery: GalleryImage[];
  reviews: {
    rating: number;
    count: string;
    externalUrl: string;
    items: ReviewItem[];
  };
}

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
}
