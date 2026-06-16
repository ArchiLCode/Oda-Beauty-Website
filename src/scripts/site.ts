const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');

const setMenuOpen = (open: boolean) => {
  if (!toggle || !mobileMenu) return;
  toggle.setAttribute('aria-expanded', String(open));
  mobileMenu.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
};

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
  }
});

document.querySelectorAll<HTMLElement>('[data-services]').forEach((serviceBlock) => {
  const tabs = Array.from(serviceBlock.querySelectorAll<HTMLButtonElement>('[data-service-tab]'));
  const cards = Array.from(serviceBlock.querySelectorAll<HTMLElement>('[data-service-card]'));

  const activate = (category: string) => {
    tabs.forEach((tab) => {
      tab.setAttribute('aria-selected', String(tab.dataset.serviceTab === category));
    });
    cards.forEach((card) => {
      card.hidden = card.dataset.serviceCard !== category;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.serviceTab) {
        activate(tab.dataset.serviceTab);
      }
    });
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-rail-prev], [data-rail-next]').forEach((button) => {
  button.addEventListener('click', () => {
    const railId = button.dataset.railPrev ?? button.dataset.railNext;
    const rail = railId ? document.getElementById(railId) : null;
    if (!rail) return;
    const direction = button.dataset.railNext ? 1 : -1;
    rail.scrollBy({ left: rail.clientWidth * 0.82 * direction, behavior: 'smooth' });
  });
});

const floatingCta = document.querySelector<HTMLElement>('[data-floating-cta]');
const footer = document.querySelector<HTMLElement>('footer');

if (floatingCta && footer) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      floatingCta.dataset.hidden = String(entry.isIntersecting);
    },
    { threshold: 0.12 },
  );
  observer.observe(footer);
}
