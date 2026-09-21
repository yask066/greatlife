import { describe, expect, it } from 'vitest';

import * as contactModule from '../../src/content/contacts';

describe('central contact configuration', () => {
  it('exports one approved contact object with the supplied values', () => {
    expect(Object.keys(contactModule)).toEqual(['contacts']);
    expect(contactModule.contacts).toEqual({
      phoneDisplay: '+375 (29) 123-45-67',
      phoneHref: 'tel:+375291234567',
      telegramHref: 'https://t.me/nickname',
      approval: 'approved',
    });
  });
});
