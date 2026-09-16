import { initTabs } from '../lib/tabs';
import { initMenu } from '../lib/menu';
import { initFaq } from '../lib/faq';

const initialize = () => {
  document.querySelectorAll<HTMLElement>('[data-mobile-menu]').forEach((root) => {
    initMenu(root);
  });

  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    initTabs(root);
  });

  document.querySelectorAll<HTMLElement>('[data-faq]').forEach((root) => {
    initFaq(root);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
