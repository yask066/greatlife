import { describe, expect, it } from 'vitest';

import * as contactModule from '../../src/content/contacts';

describe('central contact configuration', () => {
  it('exports one demo contact object with the PRD contact values', () => {
    expect(Object.keys(contactModule)).toEqual(['contacts']);
    expect(contactModule.contacts).toEqual({
      phoneDisplay: '+375 29 000-00-00',
      phoneHref: 'tel:+375290000000',
      telegramHref: 'https://t.me/prekrasnaya_zhizn_demo',
      approval: 'demo',
    });
  });
});
