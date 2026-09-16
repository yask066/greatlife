import { initTabs } from '../lib/tabs';

const initialize = () => {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    initTabs(root);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
