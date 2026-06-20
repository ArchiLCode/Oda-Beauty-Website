import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('social menu markup', () => {
  it('renders one reusable menu in desktop, mobile and footer contexts', () => {
    const header = readSource('../src/components/Header.astro');
    const footer = readSource('../src/components/Footer.astro');

    expect(header).toContain('<SocialMenu id="header"');
    expect(header).toContain('<SocialMenu id="header-mobile"');
    expect(header).toContain('content.contacts.phoneHref');
    expect(footer).toContain('<SocialMenu id="footer"');
    expect(footer).not.toContain('footer-whatsapp');
    expect(footer).not.toContain('social-row');
  });

  it('exposes accessible trigger and menu semantics', () => {
    const component = readSource('../src/components/SocialMenu.astro');

    expect(component).toContain('aria-expanded="false"');
    expect(component).toContain('data-social-menu-trigger');
    expect(component).toContain('data-social-menu-popover');
    expect(component).toContain('role="menuitem"');
    expect(component).toContain('rel="noreferrer"');
  });

  it('closes menus on outside click and Escape while keeping accessibility state in sync', () => {
    const script = readSource('../src/scripts/site.ts');

    expect(script).toContain("popover.toggleAttribute('inert', !open)");
    expect(script).toContain("menu.dataset.open === 'true'");
    expect(script).toContain("socialMenus.every((menu) => !menu.contains(target))");
    expect(script).toContain("setSocialMenuOpen(menu, false, true)");
  });

  it('styles open, focus, mobile and footer menu states', () => {
    const styles = readSource('../src/styles/global.css');

    expect(styles).toContain('.social-menu[data-open="true"] .social-menu__popover');
    expect(styles).toContain('.social-menu__trigger:focus-visible');
    expect(styles).toContain('.social-menu--footer .social-menu__popover');
    expect(styles).toContain('.mobile-actions');
    expect(styles).toContain('grid-column: 3;');
    expect(styles).toContain('.social-menu--footer .social-menu__trigger');
  });
});
