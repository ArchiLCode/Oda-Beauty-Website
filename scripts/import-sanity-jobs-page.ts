import 'dotenv/config';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import {
  createClient,
  type IdentifiedSanityDocumentStub,
  type SanityClient,
} from '@sanity/client';
import { getStaticJobsPageContent } from '../src/content/static-provider';
import type { ImageRef } from '../src/content/types';
import { validateJobsPageContent } from '../src/content/validate';

const apiVersion = '2026-06-18';

const requireEnvironment = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to import the jobs page into Sanity.`);
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

const jobsContent = getStaticJobsPageContent();
const jobsValidation = validateJobsPageContent(jobsContent);
if (!jobsValidation.valid) {
  throw new Error(`Static jobs content validation failed:\n- ${jobsValidation.errors.join('\n- ')}`);
}

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

const buildJobsPageDocument = async (): Promise<IdentifiedSanityDocumentStub> => ({
  _id: 'jobsPage',
  _type: 'jobsPage',
  seo: { _type: 'seo', ...jobsContent.page.seo },
  hero: {
    _type: 'object',
    ...jobsContent.page.hero,
    image: await uploadImage(client, jobsContent.page.hero.image),
  },
  benefits: jobsContent.page.benefits.map((benefit, index) => ({
    _key: benefit.id,
    _type: 'object',
    ...benefit,
    order: (index + 1) * 10,
  })),
  workBenefits: jobsContent.page.workBenefits.map((benefit, index) => ({
    _key: benefit.id,
    _type: 'object',
    ...benefit,
    order: (index + 1) * 10,
  })),
  resumeCta: {
    _type: 'object',
    ...jobsContent.page.resumeCta,
    image: await uploadImage(client, jobsContent.page.resumeCta.image),
  },
});

const jobsPage = await buildJobsPageDocument();
await client.createOrReplace(jobsPage, { visibility: 'sync' });
console.log(`Imported jobsPage into ${projectId}/${dataset}. Vacancies were not imported.`);
