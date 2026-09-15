import { describe, expect, it } from 'vitest';

import type {
  Approval,
  Audience,
  ContactConfig,
  Direction,
  DirectionId,
  FaqItem,
  Professional,
  Service,
  Testimonial,
} from '../../src/types/content';

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
  (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false;

type Assert<Condition extends true> = Condition;

export type ContentContractAssertions = [
  Assert<Equal<DirectionId, 'speech' | 'psychology' | 'bowls'>>,
  Assert<Equal<Audience, 'teen' | 'parent' | 'adult'>>,
  Assert<Equal<Approval, 'demo' | 'approved'>>,
  Assert<Equal<ContactConfig['phoneHref'], `tel:${string}`>>,
  Assert<Equal<ContactConfig['telegramHref'], `https://t.me/${string}`>>,
  Assert<Equal<keyof Service, 'id' | 'title' | 'description' | 'audiences'>>,
  Assert<Equal<Direction['id'], DirectionId>>,
  Assert<Equal<Direction['services'], Service[]>>,
  Assert<Equal<keyof FaqItem, 'id' | 'question' | 'answer'>>,
  Assert<Equal<Professional['approval'], Approval>>,
  Assert<Equal<Professional['photoConsent'], boolean>>,
  Assert<
    Equal<
      Professional['photo'],
      { src: string; alt: string; width: number; height: number }
    >
  >,
  Assert<Equal<Testimonial['approval'], Approval>>,
  Assert<Equal<Testimonial['authorConsent'], boolean>>,
];

describe('content type contracts', () => {
  it('accepts a contact configuration that follows the public contract', () => {
    const contact = {
      phoneDisplay: '+375 00 000-00-00',
      phoneHref: 'tel:+375000000000',
      telegramHref: 'https://t.me/example',
      approval: 'demo',
    } satisfies ContactConfig;

    expect(contact.approval).toBe('demo');
  });
});
