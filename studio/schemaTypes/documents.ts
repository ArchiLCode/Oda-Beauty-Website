import { defineArrayMember, defineField, defineType } from 'sanity';

const idField = defineField({
  name: 'id',
  title: 'Стабильный ID',
  type: 'string',
  description: 'Уникальное значение без пробелов. После публикации не менять.',
  validation: (Rule) => Rule.required().regex(/^\S+$/u),
});

const orderField = defineField({
  name: 'order',
  title: 'Порядок',
  type: 'number',
  initialValue: 100,
  validation: (Rule) => Rule.required().integer().min(0),
});

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Лендинг',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'nav',
      title: 'Навигация',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: 'contacts', title: 'Контакты', type: 'contactInfo', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'socials',
      title: 'Социальные сети',
      type: 'array',
      of: [defineArrayMember({ type: 'socialLink' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'hero', title: 'Первый экран', type: 'heroSection', validation: (Rule) => Rule.required() }),
    defineField({ name: 'about', title: 'О салоне', type: 'aboutSection', validation: (Rule) => Rule.required() }),
    defineField({ name: 'reviews', title: 'Сводка отзывов', type: 'reviewSummary', validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: 'Лендинг ODa Beauty' }) },
});

export const serviceCategory = defineType({
  name: 'serviceCategory',
  title: 'Категория услуг',
  type: 'document',
  fields: [
    idField,
    defineField({ name: 'title', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Изображение', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    orderField,
  ],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'id', media: 'image' } },
});

export const service = defineType({
  name: 'service',
  title: 'Услуга',
  type: 'document',
  fields: [
    idField,
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'price', title: 'Цена', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'duration', title: 'Продолжительность', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'bookingUrl',
      title: 'Онлайн-запись',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'image', title: 'Изображение', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    defineField({ name: 'featured', title: 'Популярная услуга', type: 'boolean', initialValue: false }),
    orderField,
  ],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'price', media: 'image' } },
});

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Сотрудник',
  type: 'document',
  fields: [
    idField,
    defineField({ name: 'name', title: 'Имя', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Роль', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'bookingUrl',
      title: 'Онлайн-запись',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'image', title: 'Фото', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    orderField,
  ],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
});

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Изображение галереи',
  type: 'document',
  fields: [idField, defineField({ name: 'image', title: 'Изображение', type: 'imageWithAlt', validation: (Rule) => Rule.required() }), orderField],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'image.alt', media: 'image' } },
});

export const brandLogo = defineType({
  name: 'brandLogo',
  title: 'Логотип бренда',
  type: 'document',
  fields: [
    idField,
    defineField({ name: 'name', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'image', title: 'Логотип', type: 'imageWithAlt', validation: (Rule) => Rule.required() }),
    orderField,
  ],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'id', media: 'image' } },
});

export const review = defineType({
  name: 'review',
  title: 'Отзыв',
  type: 'document',
  fields: [
    idField,
    defineField({ name: 'author', title: 'Автор', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'rating', title: 'Рейтинг', type: 'number', validation: (Rule) => Rule.required().integer().min(1).max(5) }),
    defineField({ name: 'text', title: 'Текст', type: 'text', rows: 5, validation: (Rule) => Rule.required() }),
    orderField,
  ],
  orderings: [{ title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'author', subtitle: 'text' } },
});

export const documentSchemaTypes = [
  landingPage,
  serviceCategory,
  service,
  teamMember,
  galleryImage,
  brandLogo,
  review,
];
