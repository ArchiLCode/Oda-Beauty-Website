import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ODa Beauty')
    .items([
      S.listItem()
        .title('Лендинг')
        .id('landingPage')
        .child(S.document().schemaType('landingPage').documentId('landingPage')),
      S.listItem()
        .title('Страница вакансий')
        .id('jobsPage')
        .child(S.document().schemaType('jobsPage').documentId('jobsPage')),
      S.divider(),
      S.documentTypeListItem('jobVacancy').title('Вакансии'),
      S.documentTypeListItem('serviceCategory').title('Категории услуг'),
      S.documentTypeListItem('service').title('Услуги'),
      S.documentTypeListItem('teamMember').title('Команда'),
      S.documentTypeListItem('galleryImage').title('Галерея'),
      S.documentTypeListItem('brandLogo').title('Бренды'),
      S.documentTypeListItem('review').title('Отзывы'),
    ]);
