import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('jobs page source integration', () => {
  it('uses a shared Astro layout with client-side route transitions', () => {
    const layout = readSource('../src/layouts/BaseLayout.astro');
    const homePage = readSource('../src/pages/index.astro');

    expect(layout).toContain("import { ClientRouter } from 'astro:transitions'");
    expect(layout).toContain('<ClientRouter');
    expect(layout).toContain('<Header content={content}');
    expect(layout).toContain('<Footer content={content}');
    expect(layout).toContain('transition:persist');
    expect(layout).toContain('transition:name="page-main"');
    expect(homePage).not.toContain('<Header content={content}');
    expect(homePage).not.toContain('<Footer content={content}');
  });

  it('links the footer to the jobs page without adding jobs to the main header nav', () => {
    const footer = readSource('../src/components/Footer.astro');
    const staticProvider = readSource('../src/content/static-provider.ts');

    expect(footer).toContain('href="/job"');
    expect(footer).toContain('Вакансии');
    expect(staticProvider).not.toContain('{ label: "Вакансии", href: "/job" }');
  });

  it('reinitializes browser interactions after Astro client-side page loads', () => {
    const script = readSource('../src/scripts/site.ts');

    expect(script).toContain("document.addEventListener('astro:page-load'");
    expect(script).toContain('data-initialized');
    expect(script).toContain('setMenuOpen(false)');
  });

  it('renders the /job route from CMS-managed jobs content', () => {
    const page = readSource('../src/pages/job.astro');
    const component = readSource('../src/components/JobsPage.astro');

    expect(page).toContain('getJobsPageContent');
    expect(page).toContain('seo={jobsContent.page.seo}');
    expect(page).toContain('<JobsPage content={jobsContent}');
    expect(component).toContain('Актуальные вакансии');
    expect(component).toContain('content.vacancies.map');
    expect(component).toContain('jobs-empty');
  });

  it('registers jobs CMS documents in Sanity Studio and protects the jobs singleton', () => {
    const documents = readSource('../studio/schemaTypes/documents.ts');
    const structure = readSource('../studio/structure.ts');
    const studioConfig = readSource('../studio/sanity.config.ts');

    expect(documents).toContain("name: 'jobsPage'");
    expect(documents).toContain("name: 'jobVacancy'");
    expect(structure).toContain("documentId('jobsPage')");
    expect(structure).toContain("S.documentTypeListItem('jobVacancy')");
    expect(studioConfig).toContain("context.schemaType === 'landingPage' || context.schemaType === 'jobsPage'");
    expect(studioConfig).toContain("templateId !== 'jobsPage'");
  });

  it('includes jobs documents in CMS import, webhook docs and sitemap', () => {
    const importScript = readSource('../scripts/import-sanity-content.ts');
    const cmsDocs = readSource('../docs/cms-setup.md');
    const sitemap = readSource('../src/pages/sitemap.xml.ts');

    expect(importScript).toContain("_id: 'jobsPage'");
    expect(importScript).toContain("_type: 'jobVacancy'");
    expect(cmsDocs).toContain('"jobsPage"');
    expect(cmsDocs).toContain('"jobVacancy"');
    expect(sitemap).toContain("new URL('/job', site)");
  });

  it('has a targeted import command for the jobs page singleton without vacancies', () => {
    const packageJson = readSource('../package.json');
    const jobsImportScript = readSource('../scripts/import-sanity-jobs-page.ts');

    expect(packageJson).toContain('"sanity:import:jobs"');
    expect(jobsImportScript).toContain("_id: 'jobsPage'");
    expect(jobsImportScript).toContain("getStaticJobsPageContent");
    expect(jobsImportScript).not.toContain("_type: 'jobVacancy'");
    expect(jobsImportScript).not.toContain('toSanityDocumentId');
  });
});
