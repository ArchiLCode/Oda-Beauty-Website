const wasInitialized = (element: HTMLElement) => element.getAttribute('data-initialized') === 'true';

const markInitialized = (element: HTMLElement) => {
  if (wasInitialized(element)) return false;
  element.setAttribute('data-initialized', 'true');
  return true;
};

const getSocialMenus = () => Array.from(document.querySelectorAll<HTMLElement>('[data-social-menu]'));

const setSocialMenuOpen = (menu: HTMLElement, open: boolean, restoreFocus = false) => {
  const trigger = menu.querySelector<HTMLButtonElement>('[data-social-menu-trigger]');
  const popover = menu.querySelector<HTMLElement>('[data-social-menu-popover]');
  if (!trigger || !popover) return;

  menu.dataset.open = String(open);
  trigger.setAttribute('aria-expanded', String(open));
  popover.setAttribute('aria-hidden', String(!open));
  popover.toggleAttribute('inert', !open);
  if (restoreFocus) trigger.focus();
};

const closeSocialMenus = (except?: HTMLElement) => {
  getSocialMenus().forEach((menu) => {
    if (menu !== except) setSocialMenuOpen(menu, false);
  });
};

const getMenuElements = () => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const menuLabel = toggle?.querySelector<HTMLElement>('.sr-only');

  return { toggle, mobileMenu, menuLabel };
};

const setMenuOpen = (open: boolean) => {
  const { toggle, mobileMenu, menuLabel } = getMenuElements();
  if (!toggle || !mobileMenu) return;
  toggle.setAttribute('aria-expanded', String(open));
  mobileMenu.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
  if (menuLabel) {
    menuLabel.textContent = open ? 'Закрыть меню' : 'Открыть меню';
  }
};

const initSocialMenus = () => {
  getSocialMenus().forEach((menu) => {
    if (!markInitialized(menu)) return;
    const trigger = menu.querySelector<HTMLButtonElement>('[data-social-menu-trigger]');

    trigger?.addEventListener('click', () => {
      const willOpen = menu.dataset.open !== 'true';
      closeSocialMenus(willOpen ? menu : undefined);
      setSocialMenuOpen(menu, willOpen);
    });

    menu.querySelectorAll<HTMLAnchorElement>('[data-social-menu-link]').forEach((link) => {
      link.addEventListener('click', () => setSocialMenuOpen(menu, false));
    });
  });
};

const initMobileMenu = () => {
  const { toggle } = getMenuElements();

  if (toggle && markInitialized(toggle)) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    if (!markInitialized(link)) return;
    link.addEventListener('click', () => setMenuOpen(false));
  });
};

const initServices = () => {
  document.querySelectorAll<HTMLElement>('[data-services]').forEach((serviceBlock) => {
    if (!markInitialized(serviceBlock)) return;

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
};

const initRails = () => {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((rail) => {
    if (!markInitialized(rail)) return;

    const prevButton = document.querySelector<HTMLButtonElement>(`[data-rail-prev="${rail.id}"]`);
    const nextButton = document.querySelector<HTMLButtonElement>(`[data-rail-next="${rail.id}"]`);
    const dotButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(`[data-rail-dots="${rail.id}"] button`),
    );

    const getMaxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    const getDotTarget = (index: number) => {
      const maxScroll = getMaxScroll();
      if (dotButtons.length <= 1) return 0;
      return (maxScroll / (dotButtons.length - 1)) * index;
    };

    const getActiveDotIndex = () => {
      if (dotButtons.length <= 1) return 0;
      const maxScroll = getMaxScroll();
      if (maxScroll <= 2) return 0;
      return Math.min(dotButtons.length - 1, Math.round((rail.scrollLeft / maxScroll) * (dotButtons.length - 1)));
    };

    const updateRailDots = () => {
      const activeIndex = getActiveDotIndex();
      const isScrollable = getMaxScroll() > 2;

      dotButtons.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.setAttribute('aria-current', String(isActive));
        dot.disabled = !isScrollable;
        dot.setAttribute('aria-disabled', String(!isScrollable));
      });
    };

    const updateRailButtons = () => {
      const maxScroll = getMaxScroll();
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
      updateRailDots();
    };

    [prevButton, nextButton].forEach((button) => {
      button?.addEventListener('click', () => {
        const direction = button === nextButton ? 1 : -1;
        rail.scrollBy({ left: rail.clientWidth * 0.82 * direction, behavior: 'smooth' });
      });
    });

    dotButtons.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        rail.scrollTo({ left: getDotTarget(index), behavior: 'smooth' });
      });
    });

    rail.addEventListener('scroll', updateRailButtons, { passive: true });
    window.addEventListener('resize', updateRailButtons);
    updateRailButtons();
  });
};

const initFloatingCta = () => {
  const floatingCta = document.querySelector<HTMLElement>('[data-floating-cta]');
  const footer = document.querySelector<HTMLElement>('footer');
  const state = window as Window & { __odaFloatingCtaObserver?: IntersectionObserver };

  state.__odaFloatingCtaObserver?.disconnect();

  if (floatingCta && footer) {
    state.__odaFloatingCtaObserver = new IntersectionObserver(
      ([entry]) => {
        floatingCta.dataset.hidden = String(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    state.__odaFloatingCtaObserver.observe(footer);
  }
};

const initDocumentListeners = () => {
  const state = window as Window & { __odaSiteListenersInitialized?: boolean };
  if (state.__odaSiteListenersInitialized) return;
  state.__odaSiteListenersInitialized = true;
  document.documentElement.setAttribute('data-initialized', 'true');

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    const socialMenus = getSocialMenus();
    if (socialMenus.every((menu) => !menu.contains(target))) closeSocialMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      getSocialMenus().forEach((menu) => {
        if (menu.dataset.open === 'true') setSocialMenuOpen(menu, false, true);
      });
      setMenuOpen(false);
    }
  });
};

const initSite = () => {
  initDocumentListeners();
  initSocialMenus();
  initMobileMenu();
  initServices();
  initRails();
  initFloatingCta();
  closeSocialMenus();
  setMenuOpen(false);
};

initSite();
document.addEventListener('astro:page-load', initSite);
