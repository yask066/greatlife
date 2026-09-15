import { describe, expect, it } from 'vitest';

import { faqItems } from '../../src/content/faq';

describe('FAQ content', () => {
  it('covers the six required visitor questions with usable answers', () => {
    expect(faqItems.map(({ question }) => question)).toEqual([
      'Кому подходят занятия?',
      'Как выбрать направление?',
      'Как проходит первая встреча?',
      'Работают ли специалисты с подростками?',
      'Где находится центр?',
      'Как записаться?',
    ]);

    expect(faqItems).toHaveLength(6);
    expect(faqItems.every(({ answer }) => answer.trim().length > 0)).toBe(
      true,
    );

    const ids = faqItems.map(({ id }) => id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('describes the location without inventing a street address', () => {
    const location = faqItems.find(
      ({ question }) => question === 'Где находится центр?',
    );
    const answer = location?.answer ?? '';

    expect(location).toBeDefined();
    expect(answer).toContain('очные занятия в Минске');
    expect(answer).toContain('по телефону или в Telegram');
    expect(answer).not.toMatch(
      /\b(?:улица|ул\.|проспект|пр-т|переулок|дом)\b/iu,
    );
  });
});
