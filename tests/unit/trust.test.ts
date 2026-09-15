import { describe, expect, it } from 'vitest';

import {
  professionals,
  professionalsEmptyState,
  testimonials,
  testimonialsEmptyState,
} from '../../src/content/trust';
import { approvedContent } from '../fixtures/approved-content';

describe('trust content', () => {
  it('keeps production trust collections empty until real content is approved', () => {
    expect(professionals).toEqual([]);
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
