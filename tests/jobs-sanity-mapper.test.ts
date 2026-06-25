import { describe, expect, it } from 'vitest';

const image = (name: string, alt: string) => ({
  url: `https://cdn.sanity.io/images/project/production/${name}.jpg`,
  alt,
});

const payload = {
  page: {
    seo: {
      title: 'Вакансии ODa Beauty',
      description: 'Работа в салоне красоты ODa Beauty в Смоленске',
      canonicalUrl: 'https://oda-beauty.ru/job',
      keywords: ['вакансии салон красоты', 'ODa Beauty работа'],
    },
    hero: {
      title: 'Присоединяйтесь к команде ODa',
      text: 'Мы всегда в поиске талантливых специалистов.',
      ctaLabel: 'Смотреть вакансии',
      ctaUrl: '#vacancies',
      image: image('jobs-hero', 'Интерьер салона ODa Beauty'),
    },
    benefits: [
      { id: 'care', label: 'Забота о команде', text: 'Комфортные условия', icon: 'heart', order: 10 },
      { id: 'education', label: 'Обучение', text: 'Рост и развитие', icon: 'education', order: 20 },
    ],
    workBenefits: [
      { id: 'studio', label: 'Комфортная студия', text: 'Стильное рабочее место', icon: 'gift', order: 10 },
    ],
    resumeCta: {
      title: 'Не нашли подходящую вакансию, но хотите работать с нами?',
      text: 'Отправьте свое резюме.',
      buttonLabel: 'Отправить резюме',
      url: 'https://t.me/ODaBEAUTY67',
      image: image('jobs-resume', 'Мастер ODa Beauty'),
    },
  },
  vacancies: [
    {
      id: 'manicure-master',
      title: 'Мастер маникюра',
      salary: 'от 60 000 ₽',
      experience: 'Опыт от 1 года',
      requirements: ['Опыт работы от 1 года', 'Коммуникабельность', 'Желание развиваться'],
      applicationUrl: 'https://t.me/ODaBEAUTY67',
      buttonLabel: 'Подробнее',
      published: true,
      order: 10,
      image: image('job-manicure', 'Работа мастера маникюра'),
    },
  ],
};

describe('Sanity jobs mapper', () => {
  it('maps Sanity jobs page documents into the jobs content contract', async () => {
    const mapper = await import('../src/content/sanity/mapper');
    const validate = await import('../src/content/validate');
    const mapSanityJobsPageContent = (mapper as Record<string, unknown>).mapSanityJobsPageContent;
    const validateJobsPageContent = (validate as Record<string, unknown>).validateJobsPageContent;

    expect(typeof mapSanityJobsPageContent).toBe('function');
    expect(typeof validateJobsPageContent).toBe('function');

    const content = (mapSanityJobsPageContent as (value: unknown) => unknown)(payload);
    const result = (validateJobsPageContent as (value: unknown) => { errors: string[] })(content);

    expect(result.errors).toEqual([]);
    expect((content as { page: { hero: { image: { src: string } } } }).page.hero.image.src).toContain('/jobs-hero.jpg');
    expect((content as { page: { benefits: Array<{ icon: string }> } }).page.benefits[0].icon).toBe('heart');
    expect((content as { vacancies: Array<{ title: string; image: { alt: string } }> }).vacancies[0].title).toBe('Мастер маникюра');
    expect((content as { vacancies: Array<{ image: { alt: string } }> }).vacancies[0].image.alt).toBe('Работа мастера маникюра');
  });

  it('fails fast when the jobs singleton is missing', async () => {
    const mapper = await import('../src/content/sanity/mapper');
    const mapSanityJobsPageContent = (mapper as Record<string, unknown>).mapSanityJobsPageContent as
      | ((value: unknown) => unknown)
      | undefined;

    expect(typeof mapSanityJobsPageContent).toBe('function');
    expect(() => mapSanityJobsPageContent?.({ ...payload, page: null })).toThrow(
      'Sanity jobsPage document was not found.',
    );
  });
});
