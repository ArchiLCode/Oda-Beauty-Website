import { defineArrayMember, defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Изображение',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt-текст',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'keywords',
      title: 'Ключевые слова',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

export const navLink = defineType({
  name: 'navLink',
  title: 'Пункт меню',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', title: 'Ссылка', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

export const localImageRef = defineType({
  name: 'localImageRef',
  title: 'Локальная иконка',
  type: 'object',
  fields: [
    defineField({ name: 'src', title: 'Путь', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt-текст', type: 'string', validation: (Rule) => Rule.required() }),
  ],
});

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Социальная сеть',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'url',
      title: 'Ссылка',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'icon', title: 'Иконка', type: 'localImageRef' }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
});

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Контакты',
  type: 'object',
  fields: [
    defineField({ name: 'phone', title: 'Телефон', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'phoneHref', title: 'Телефонная ссылка', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'city', title: 'Город', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'address', title: 'Адрес', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'mapUrl',
      title: 'Ссылка на карту',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Embed URL карты',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'hours', title: 'Часы работы', type: 'string', validation: (Rule) => Rule.required() }),
  ],
});

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Первый экран',
  type: 'object',
  fields: [
    defineField({ name: 'brand', title: 'Бренд', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Подзаголовок', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'services',
      title: 'Короткий список услуг',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Онлайн-запись',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'desktopImage', title: 'Изображение для desktop', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    defineField({ name: 'mobileImage', title: 'Изображение для mobile', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
  ],
});

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'О салоне',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'text',
      title: 'Абзацы',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: 'image', title: 'Изображение', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
  ],
});

export const reviewSummary = defineType({
  name: 'reviewSummary',
  title: 'Сводка отзывов',
  type: 'object',
  fields: [
    defineField({ name: 'rating', title: 'Рейтинг', type: 'number', validation: (Rule) => Rule.required().min(0).max(5) }),
    defineField({ name: 'count', title: 'Количество', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'externalUrl',
      title: 'Все отзывы',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
});

export const commonSchemaTypes = [
  imageWithAlt,
  seo,
  navLink,
  localImageRef,
  socialLink,
  contactInfo,
  heroSection,
  aboutSection,
  reviewSummary,
];
