import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { DIRECTION_IDS, initTabs } from '../../src/lib/tabs';

const tabMarkup = `
  <div data-tabs>
    <div role="tablist" aria-label="Направления">
      ${DIRECTION_IDS.map(
        (id) =>
          `<button id="tab-${id}" role="tab" aria-controls="panel-${id}" aria-selected="false" tabindex="-1">${id}</button>`,
      ).join('')}
    </div>
    ${DIRECTION_IDS.map(
      (id) =>
        `<section id="panel-${id}" role="tabpanel" aria-labelledby="tab-${id}">${id} panel</section>`,
    ).join('')}
  </div>
`;

function renderTabs() {
  document.body.innerHTML = tabMarkup;
  const root = document.querySelector<HTMLElement>('[data-tabs]');
  if (!root) throw new Error('tabs fixture was not rendered');

  return { root, tabs: [...root.querySelectorAll<HTMLElement>('[role="tab"]')] };
}

function tab(root: HTMLElement, id: string) {
  const element = root.querySelector<HTMLElement>(`#tab-${id}`);
  if (!element) throw new Error(`tab ${id} was not rendered`);
  return element;
}

function panel(root: HTMLElement, id: string) {
  const element = root.querySelector<HTMLElement>(`#panel-${id}`);
  if (!element) throw new Error(`panel ${id} was not rendered`);
  return element;
}

describe('direction tabs contract', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('defaults to psychology and exposes one active panel', () => {
    const { root, tabs } = renderTabs();
    const cleanup = initTabs(root);

    expect(tabs.find((item) => item.getAttribute('aria-selected') === 'true')).toBe(
      tab(root, 'psychology'),
    );
    expect(tab(root, 'psychology').tabIndex).toBe(0);
    expect(panel(root, 'psychology').hidden).toBe(false);
    expect(panel(root, 'speech').hidden).toBe(true);
    expect(panel(root, 'bowls').hidden).toBe(true);

    cleanup();
  });

  it.each(DIRECTION_IDS)('activates the direction selected by hash: #%s', (id) => {
    window.history.replaceState({}, '', `/#${id}`);
    const { root } = renderTabs();
    const cleanup = initTabs(root);

    expect(tab(root, id).getAttribute('aria-selected')).toBe('true');
    expect(panel(root, id).hidden).toBe(false);

    cleanup();
  });

  it('falls back to psychology and normalizes an unknown hash', () => {
    window.history.replaceState({}, '', '/#unknown');
    const { root } = renderTabs();
    const cleanup = initTabs(root);

    expect(window.location.hash).toBe('#psychology');
    expect(tab(root, 'psychology').getAttribute('aria-selected')).toBe('true');

    cleanup();
  });

  it('changes the hash and active panel when a tab is clicked', () => {
    const { root } = renderTabs();
    const cleanup = initTabs(root);

    tab(root, 'speech').click();

    expect(window.location.hash).toBe('#speech');
    expect(tab(root, 'speech').getAttribute('aria-selected')).toBe('true');
    expect(panel(root, 'speech').hidden).toBe(false);

    cleanup();
  });

  it('moves focus and selection cyclically with ArrowRight and ArrowLeft', () => {
    const { root } = renderTabs();
    const cleanup = initTabs(root);
    const psychology = tab(root, 'psychology');
    psychology.focus();

    psychology.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(tab(root, 'bowls'));
    expect(tab(root, 'bowls').getAttribute('aria-selected')).toBe('true');

    tab(root, 'bowls').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(document.activeElement).toBe(tab(root, 'speech'));

    tab(root, 'speech').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(document.activeElement).toBe(tab(root, 'bowls'));

    cleanup();
  });

  it('moves focus to the first and last tab with Home and End', () => {
    const { root } = renderTabs();
    const cleanup = initTabs(root);

    tab(root, 'psychology').focus();
    tab(root, 'psychology').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(tab(root, 'speech'));

    tab(root, 'speech').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(tab(root, 'bowls'));

    cleanup();
  });

  it.each(['Enter', ' '])('activates the focused tab with %s', (key) => {
    const { root } = renderTabs();
    const cleanup = initTabs(root);
    const speech = tab(root, 'speech');
    speech.focus();

    speech.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

    expect(window.location.hash).toBe('#speech');
    expect(speech.getAttribute('aria-selected')).toBe('true');
    expect(panel(root, 'speech').hidden).toBe(false);

    cleanup();
  });

  it('removes listeners when cleanup is called', () => {
    const { root } = renderTabs();
    const cleanup = initTabs(root);
    cleanup();

    tab(root, 'speech').click();

    expect(window.location.hash).toBe('');
    expect(tab(root, 'psychology').getAttribute('aria-selected')).toBe('true');
    expect(tab(root, 'speech').getAttribute('aria-selected')).toBe('false');
  });
});
