const DESKTOP_MEDIA_QUERY = '(min-width: 48rem)';

export const initMenu = (root: HTMLElement): (() => void) => {
  const trigger = root.querySelector<HTMLButtonElement>('[data-menu-trigger]');
  const navigation = root.querySelector<HTMLElement>('#primary-navigation');
  const links = navigation ? Array.from(navigation.querySelectorAll<HTMLAnchorElement>('a')) : [];

  if (!trigger || !navigation) {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  let menuOpen = false;

  const syncState = () => {
    const isDesktop = mediaQuery.matches;
    const visible = isDesktop || menuOpen;

    root.dataset.menuEnhanced = 'true';
    root.dataset.menuOpen = String(menuOpen);
    navigation.hidden = !visible;
    trigger.setAttribute('aria-expanded', String(menuOpen));
    trigger.setAttribute('aria-label', menuOpen ? 'Закрыть меню' : 'Открыть меню');
    links.forEach((link) => {
      link.tabIndex = visible ? 0 : -1;
    });
  };

  const closeMenu = () => {
    menuOpen = false;
    syncState();
    if (!mediaQuery.matches) {
      trigger.focus();
    }
  };

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    syncState();
    if (menuOpen) {
      trigger.focus();
    }
  };

  const handleTriggerClick = () => {
    toggleMenu();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault();
      closeMenu();
    }
  };

  const handleLinkClick = () => {
    closeMenu();
    if (!mediaQuery.matches) {
      window.setTimeout(() => trigger.focus(), 50);
    }
  };

  const handleBreakpointChange = () => {
    if (mediaQuery.matches) {
      menuOpen = false;
    }
    syncState();
  };

  trigger.addEventListener('click', handleTriggerClick);
  root.addEventListener('keydown', handleKeydown);
  links.forEach((link) => link.addEventListener('click', handleLinkClick));
  mediaQuery.addEventListener('change', handleBreakpointChange);
  syncState();

  return () => {
    trigger.removeEventListener('click', handleTriggerClick);
    root.removeEventListener('keydown', handleKeydown);
    links.forEach((link) => link.removeEventListener('click', handleLinkClick));
    mediaQuery.removeEventListener('change', handleBreakpointChange);
  };
};
