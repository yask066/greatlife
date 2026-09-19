import type {
  ContactConfig,
  Professional,
  Testimonial,
} from '../types/content';

export interface ProductionContent {
  contacts: ContactConfig;
  professionals: Professional[];
  testimonials: Testimonial[];
}

export function assertProductionReady({
  contacts,
  professionals,
  testimonials,
}: ProductionContent): void {
  const violations: string[] = [];

  if (contacts.approval !== 'approved') {
    violations.push(
      "src/content/contacts.ts: contacts.approval must be 'approved'.",
    );
  }

  if (professionals.length === 0) {
    violations.push(
      'src/content/trust.ts: professionals must contain at least one approved profile.',
    );
  }

  professionals.forEach((professional) => {
    const label = `professionals[${professional.id}]`;

    if (professional.approval !== 'approved') {
      violations.push(
        `src/content/trust.ts: ${label}.approval must be 'approved'.`,
      );
    }

    if (!professional.photoConsent) {
      violations.push(
        `src/content/trust.ts: ${label}.photoConsent must be true.`,
      );
    }
  });

  testimonials.forEach((testimonial) => {
    const label = `testimonials[${testimonial.id}]`;

    if (testimonial.approval !== 'approved') {
      violations.push(
        `src/content/trust.ts: ${label}.approval must be 'approved'.`,
      );
    }

    if (!testimonial.authorConsent) {
      violations.push(
        `src/content/trust.ts: ${label}.authorConsent must be true.`,
      );
    }
  });

  if (violations.length > 0) {
    throw new Error(
      ['Production content approval failed:', ...violations]
        .map((line) => `- ${line}`)
        .join('\n'),
    );
  }
}
