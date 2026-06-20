import 'dotenv/config';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import {
  createClient,
  type IdentifiedSanityDocumentStub,
  type SanityClient,
} from '@sanity/client';
import { getStaticLandingContent } from '../src/content/static-provider';
import type { ImageRef } from '../src/content/types';
import { validateLandingContent } from '../src/content/validate';
import { toSanityDocumentId } from './sanity-id';

const apiVersion = '2026-06-18';

const requireEnvironment = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to import content into Sanity.`);
  }

  return value;
};

const projectId = requireEnvironment('SANITY_PROJECT_ID');
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = requireEnvironment('SANITY_WRITE_TOKEN');

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const content = getStaticLandingContent();
const validation = validateLandingContent(content);
if (!validation.valid) {
  throw new Error(`Static content validation failed:\n- ${validation.errors.join('\n- ')}`);
}

const { items: reviewItems, ...reviewSummary } = content.reviews;
const publicDirectory = resolve(process.cwd(), 'public');
const uploadedAssets = new Map<string, Promise<string>>();

const localImagePath = (image: ImageRef): string => {
  if (!image.src.startsWith('/')) {
    throw new Error(`Expected a local image path, received "${image.src}".`);
  }

  const absolutePath = resolve(publicDirectory, image.src.slice(1));
  if (!absolutePath.startsWith(`${publicDirectory}${sep}`)) {
    throw new Error(`Image path escapes public directory: "${image.src}".`);
  }

  return absolutePath;
};

const uploadImage = async (sanityClient: SanityClient, image: ImageRef) => {
  const cachedAsset = uploadedAssets.get(image.src);
  if (cachedAsset) {
    const assetId = await cachedAsset;
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt: image.alt,
    };
  }

  const absolutePath = localImagePath(image);
  await access(absolutePath);
  const upload = sanityClient.assets
    .upload('image', createReadStream(absolutePath), { filename: basename(absolutePath) })
    .then((asset) => {
      console.log(`Uploaded ${image.src}`);
      return asset._id;
    });
  uploadedAssets.set(image.src, upload);
  const assetId = await upload;

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: image.alt,
  };
};

const keyed = <T extends { id: string }>(value: T) => ({
  _key: value.id,
  ...value,
});

const mapSequentially = async <T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> => {
  const result: R[] = [];

  for (const [index, item] of items.entries()) {
    result.push(await mapper(item, index));
  }

  return result;
};

const buildDocuments = async () => {
  const landingPage = {
    _id: 'landingPage',
    _type: 'landingPage',
    seo: { _type: 'seo', ...content.seo },
    nav: content.nav.map((item, index) => ({
      _key: `nav-${index + 1}`,
      _type: 'navLink',
      ...item,
    })),
    contacts: { _type: 'contactInfo', ...content.contacts },
    socials: content.socials.map((social) => ({
      ...keyed(social),
      _type: 'socialLink',
      ...(social.icon ? { icon: { _type: 'localImageRef', ...social.icon } } : {}),
    })),
    hero: {
      _type: 'heroSection',
      ...content.hero,
      desktopImage: await uploadImage(client, content.hero.desktopImage),
      mobileImage: await uploadImage(client, content.hero.mobileImage),
    },
    about: {
      _type: 'aboutSection',
      ...content.about,
      image: await uploadImage(client, content.about.image),
    },
    reviews: { _type: 'reviewSummary', ...reviewSummary },
  };

  const categories = await mapSequentially(
    content.services.categories,
    async (category, index) => ({
      _id: toSanityDocumentId('serviceCategory', category.id),
      _type: 'serviceCategory',
      id: category.id,
      title: category.title,
      image: await uploadImage(client, category.image),
      order: (index + 1) * 10,
    }),
  );

  const services = await mapSequentially(
    content.services.items,
    async (service, index) => ({
      _id: toSanityDocumentId('service', service.id),
      _type: 'service',
      id: service.id,
      category: {
        _type: 'reference',
        _ref: toSanityDocumentId('serviceCategory', service.categoryId),
      },
      title: service.title,
      price: service.price,
      duration: service.duration,
      bookingUrl: service.bookingUrl,
      image: await uploadImage(client, service.image),
      featured: service.featured ?? false,
      order: (index + 1) * 10,
    }),
  );

  const team = await mapSequentially(
    content.team,
    async (member, index) => ({
      _id: toSanityDocumentId('teamMember', member.id),
      _type: 'teamMember',
      id: member.id,
      name: member.name,
      role: member.role,
      bookingUrl: member.bookingUrl,
      image: await uploadImage(client, member.image),
      order: (index + 1) * 10,
    }),
  );

  const gallery = await mapSequentially(
    content.gallery,
    async (item, index) => ({
      _id: toSanityDocumentId('galleryImage', item.id),
      _type: 'galleryImage',
      id: item.id,
      image: await uploadImage(client, item.image),
      order: (index + 1) * 10,
    }),
  );

  const brands = await mapSequentially(
    content.brands,
    async (brand, index) => ({
      _id: toSanityDocumentId('brandLogo', brand.id),
      _type: 'brandLogo',
      id: brand.id,
      name: brand.name,
      image: await uploadImage(client, brand.image),
      order: (index + 1) * 10,
    }),
  );

  const reviews = reviewItems.map((review, index) => ({
    _id: toSanityDocumentId('review', review.id),
    _type: 'review',
    ...review,
    order: (index + 1) * 10,
  }));

  return [landingPage, ...categories, ...services, ...team, ...gallery, ...brands, ...reviews];
};

const documents: IdentifiedSanityDocumentStub[] = await buildDocuments();
let transaction = client.transaction();

for (const document of documents) {
  transaction = transaction.createOrReplace(document);
}

await transaction.commit({ visibility: 'sync' });
console.log(`Imported ${documents.length} documents into ${projectId}/${dataset}.`);
