import type { DirectionId } from '../types/content';

export const DIRECTION_IDS = ['speech', 'psychology', 'bowls'] as const satisfies readonly DirectionId[];

const DEFAULT_DIRECTION: DirectionId = 'psychology';

function directionFromHash(): DirectionId {
  const hash = window.location.hash.slice(1);
  return (DIRECTION_IDS as readonly string[]).includes(hash)
    ? (hash as DirectionId)
    : DEFAULT_DIRECTION;
}

export function initTabs(root: HTMLElement): () => void {
  const tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  const tabById = new Map(tabs.map((tab) => [tab.id.replace(/^tab-/, ''), tab]));
  const panelById = new Map(
    panels.map((panel) => [panel.id.replace(/^panel-/, ''), panel]),
  );
  const validIds = DIRECTION_IDS.filter((id) => tabById.has(id) && panelById.has(id));

  root.dataset.enhanced = 'true';

  const select = (id: DirectionId, updateHash: boolean, focus: boolean) => {
    const selectedId = validIds.includes(id) ? id : DEFAULT_DIRECTION;

    tabs.forEach((tab) => {
      const isSelected = tab.id === `tab-${selectedId}`;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      const stateMarker = tab.querySelector<HTMLElement>('[data-tab-state]');
      if (stateMarker) {
        stateMarker.hidden = !isSelected;
        stateMarker.dataset.tabState = isSelected ? 'active' : 'inactive';
      }
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== `panel-${selectedId}`;
    });

    if (updateHash && window.location.hash !== `#${selectedId}`) {
      window.history.pushState({}, '', `#${selectedId}`);
    }

    if (focus) tabById.get(selectedId)?.focus();
  };

  const initialId = directionFromHash();
  if (window.location.hash && window.location.hash !== `#${initialId}`) {
    window.history.replaceState({}, '', `#${initialId}`);
  }
  select(initialId, false, false);

  const onHashChange = () => select(directionFromHash(), false, false);
  const onClick = (event: Event) => {
    const clickedTab = event.currentTarget as HTMLElement;
    const id = clickedTab.id.replace(/^tab-/, '') as DirectionId;
    select(id, true, false);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const currentTab = event.currentTarget as HTMLElement;
    const currentId = currentTab.id.replace(/^tab-/, '') as DirectionId;
    const currentIndex = validIds.indexOf(currentId);

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(currentId, true, false);
      return;
    }

    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % validIds.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + validIds.length) % validIds.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = validIds.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      select(validIds[nextIndex], true, true);
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', onClick);
    tab.addEventListener('keydown', onKeyDown);
  });
  window.addEventListener('hashchange', onHashChange);

  return () => {
    tabs.forEach((tab) => {
      tab.removeEventListener('click', onClick);
      tab.removeEventListener('keydown', onKeyDown);
    });
    window.removeEventListener('hashchange', onHashChange);
  };
}
