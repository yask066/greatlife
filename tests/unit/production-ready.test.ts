import { describe, expect, it } from 'vitest';

import { assertProductionReady } from '../../src/lib/production-ready';
import { approvedContent } from '../fixtures/approved-content';

const approvedProfessional = approvedContent.professionals[0];
const approvedTestimonial = approvedContent.testimonials[0];

if (!approvedProfessional || !approvedTestimonial) {
  throw new Error('Approved fixture must contain trust content.');
}

describe('production readiness gate', () => {
  it('rejects demo contacts', () => {
    expect(() =>
      assertProductionReady({
        ...approvedContent,
        contacts: { ...approvedContent.contacts, approval: 'demo' },
      }),
    ).toThrow(/contacts\.approval/);
  });

  it('rejects an empty professional list', () => {
    expect(() =>
      assertProductionReady({ ...approvedContent, professionals: [] }),
    ).toThrow(/professionals/);
  });

  it('rejects a professional with unapproved qualification', () => {
    expect(() =>
      assertProductionReady({
        ...approvedContent,
        professionals: [{ ...approvedProfessional, approval: 'demo' }],
      }),
    ).toThrow(/professionals.*approval/);
  });

  it('rejects a professional without photo permission', () => {
    expect(() =>
      assertProductionReady({
        ...approvedContent,
        professionals: [{ ...approvedProfessional, photoConsent: false }],
      }),
    ).toThrow(/professionals.*photoConsent/);
  });

  it('rejects an unapproved testimonial', () => {
    expect(() =>
      assertProductionReady({
        ...approvedContent,
        testimonials: [{ ...approvedTestimonial, approval: 'demo' }],
      }),
    ).toThrow(/testimonials.*approval/);
  });

  it('rejects a testimonial without author permission', () => {
    expect(() =>
      assertProductionReady({
        ...approvedContent,
        testimonials: [{ ...approvedTestimonial, authorConsent: false }],
      }),
    ).toThrow(/testimonials.*authorConsent/);
  });

  it('accepts the approved content fixture', () => {
    expect(() => assertProductionReady(approvedContent)).not.toThrow();
  });
});
