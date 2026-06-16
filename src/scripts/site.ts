const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
const menuLabel = toggle?.querySelector<HTMLElement>('.sr-only');

const setMenuOpen = (open: boolean) => {
  if (!toggle || !mobileMenu) return;
  toggle.setAttribute('aria-expanded', String(open));
  mobileMenu.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
  if (menuLabel) {
    menuLabel.textContent = open ? 'Закрыть меню' : 'Открыть меню';
  }
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

  const focusTab = (index: number) => {
    const targetTab = tabs[index];
    if (!targetTab?.dataset.serviceTab) return;
    targetTab.focus();
    activate(targetTab.dataset.serviceTab);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.serviceTab) {
        activate(tab.dataset.serviceTab);
      }
    });

    tab.addEventListener('keydown', (event) => {
      const currentIndex = tabs.indexOf(tab);
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusTab((currentIndex + 1) % tabs.length);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusTab((currentIndex - 1 + tabs.length) % tabs.length);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        focusTab(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        focusTab(tabs.length - 1);
      }
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-rail]').forEach((rail) => {
  const prevButton = document.querySelector<HTMLButtonElement>(`[data-rail-prev="${rail.id}"]`);
  const nextButton = document.querySelector<HTMLButtonElement>(`[data-rail-next="${rail.id}"]`);

  const updateRailButtons = () => {
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const atStart = rail.scrollLeft <= 2;
    const atEnd = rail.scrollLeft >= maxScroll - 2;
    if (prevButton) {
      prevButton.disabled = atStart;
      prevButton.setAttribute('aria-disabled', String(atStart));
    }
    if (nextButton) {
      nextButton.disabled = atEnd || maxScroll <= 2;
      nextButton.setAttribute('aria-disabled', String(atEnd || maxScroll <= 2));
    }
  };

  [prevButton, nextButton].forEach((button) => {
    button?.addEventListener('click', () => {
      const direction = button === nextButton ? 1 : -1;
      rail.scrollBy({ left: rail.clientWidth * 0.82 * direction, behavior: 'smooth' });
    });
  });

  rail.addEventListener('scroll', updateRailButtons, { passive: true });
  window.addEventListener('resize', updateRailButtons);
  updateRailButtons();
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
