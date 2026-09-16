import { initTabs } from '../lib/tabs';
import { initMenu } from '../lib/menu';

const initialize = () => {
  document.querySelectorAll<HTMLElement>('[data-mobile-menu]').forEach((root) => {
    initMenu(root);
  });

  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    initTabs(root);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
