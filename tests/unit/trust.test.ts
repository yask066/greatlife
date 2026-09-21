import { describe, expect, it } from 'vitest';

import {
  professionals,
  professionalsEmptyState,
  testimonials,
  testimonialsEmptyState,
} from '../../src/content/trust';
import { approvedContent } from '../fixtures/approved-content';

describe('trust content', () => {
  it('keeps the temporary profile explicitly unapproved until real content is supplied', () => {
    expect(professionals).toHaveLength(1);
    expect(professionals[0]).toMatchObject({
      id: 'temporary-professional-template',
      name: 'Имя специалиста (шаблон)',
      role: 'Должность / роль (шаблон)',
      approval: 'demo',
      photoConsent: true,
    });
    expect(professionals[0]?.qualification).toContain('будет добавлена');
    expect(professionals[0]?.photo.src).toBe('/images/minipekka.jpg');
    expect(testimonials).toEqual([]);
    expect(professionalsEmptyState).toContain('готовятся к публикации');
    expect(testimonialsEmptyState).toContain('готовятся к публикации');
  });

  it('provides a complete approved fixture for the publication gate', () => {
    expect(approvedContent.contacts.approval).toBe('approved');

    expect(approvedContent.professionals).toHaveLength(1);
    const [professional] = approvedContent.professionals;
    expect(professional).toMatchObject({
      approval: 'approved',
      photoConsent: true,
    });
    expect(professional?.name).toContain('Тестовый');
    expect(professional?.qualification.trim().length).toBeGreaterThan(0);
    expect(professional?.photo.src).toContain('/fixtures/');
    expect(professional?.photo.alt.trim().length).toBeGreaterThan(0);
    expect(professional?.photo.width).toBeGreaterThan(0);
    expect(professional?.photo.height).toBeGreaterThan(0);

    expect(approvedContent.testimonials).toHaveLength(1);
    const [testimonial] = approvedContent.testimonials;
    expect(testimonial).toMatchObject({
      approval: 'approved',
      authorConsent: true,
    });
    expect(testimonial?.quote.trim().length).toBeGreaterThan(0);
    expect(testimonial?.attribution).toContain('Тестовый');
  });
});
