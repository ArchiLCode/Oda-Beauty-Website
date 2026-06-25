import { describe, expect, it } from 'vitest';

describe('jobs page content provider', () => {
  it('provides the jobs page shell without active vacancies in shipped fallback content', async () => {
    const provider = await import('../src/content/provider');
    const validate = await import('../src/content/validate');
    const getJobsPageContent = (provider as Record<string, unknown>).getJobsPageContent;
    const validateJobsPageContent = (validate as Record<string, unknown>).validateJobsPageContent;

    expect(typeof getJobsPageContent).toBe('function');
    expect(typeof validateJobsPageContent).toBe('function');

    const content = await (getJobsPageContent as () => Promise<unknown>)();
    const result = (validateJobsPageContent as (value: unknown) => { valid: boolean; errors: string[] })(content);

    expect(result).toEqual({ valid: true, errors: [] });
    expect((content as { vacancies: unknown[] }).vacancies).toEqual([]);
    expect((content as { page: { hero: { title: string; ctaLabel: string } } }).page.hero.title).toContain('команде');
    expect((content as { page: { resumeCta: { url: string } } }).page.resumeCta.url).toBe('https://t.me/ODaBEAUTY67');
  });

  it('reports validation errors for broken jobs page content', async () => {
    const { getJobsPageContent } = await import('../src/content/provider') as {
      getJobsPageContent: () => Promise<unknown>;
    };
    const { validateJobsPageContent } = await import('../src/content/validate') as {
      validateJobsPageContent: (value: unknown) => { errors: string[] };
    };
    const content = structuredClone(await getJobsPageContent()) as {
      page: { hero: { ctaUrl: string }; resumeCta: { url: string }; benefits: Array<{ label: string }> };
      vacancies: Array<{
        id: string;
        title: string;
        salary: string;
        applicationUrl: string;
        image: { src: string; alt: string };
        requirements: string[];
      }>;
    };

    content.page.hero.ctaUrl = '';
    content.page.resumeCta.url = '';
    content.page.benefits[0].label = '';
    content.vacancies = [
      {
        id: 'broken-vacancy',
        title: 'Тестовая вакансия',
        salary: 'от 1 ₽',
        applicationUrl: '',
        image: { src: '/img/test.jpg', alt: '' },
        requirements: ['Опыт'],
      },
      {
        id: 'broken-vacancy',
        title: 'Дубликат',
        salary: 'от 1 ₽',
        applicationUrl: 'https://t.me/ODaBEAUTY67',
        image: { src: '/img/test.jpg', alt: 'Тест' },
        requirements: ['Опыт'],
      },
      {
        id: 'empty-requirements',
        title: 'Без требований',
        salary: 'от 1 ₽',
        applicationUrl: 'https://t.me/ODaBEAUTY67',
        image: { src: '/img/test.jpg', alt: 'Тест' },
        requirements: [],
      },
    ];
    content.vacancies[0].applicationUrl = '';
    content.vacancies[0].image.alt = '';
    content.vacancies[1].id = content.vacancies[0].id;
    content.vacancies[2].requirements = [];

    const result = validateJobsPageContent(content);

    expect(result.errors).toEqual(expect.arrayContaining([
      'Jobs hero is missing ctaUrl.',
      'Jobs resume CTA is missing url.',
      'Jobs benefit "0" is missing label.',
      `Vacancy "${content.vacancies[0].title}" is missing applicationUrl.`,
      `Vacancy "${content.vacancies[0].title}" is missing image alt text.`,
      `Vacancy has a duplicate id "${content.vacancies[0].id}".`,
      `Vacancy "${content.vacancies[2].title}" must have at least one requirement.`,
    ]));
  });
});
