import type {
  ContactConfig,
  Professional,
  Testimonial,
} from '../../src/types/content';

export const approvedContacts: ContactConfig = {
  phoneDisplay: '+375 29 000-00-01',
  phoneHref: 'tel:+375290000001',
  telegramHref: 'https://t.me/approved_content_fixture',
  approval: 'approved',
};

export const approvedProfessionals: Professional[] = [
  {
    id: 'approved-professional-fixture',
    name: 'Тестовый специалист',
    role: 'Психолог',
    focus: ['Психологическая поддержка'],
    qualification: 'Тестовая подтверждённая квалификация',
    photo: {
      src: '/fixtures/approved-professional.jpg',
      alt: 'Тестовая фотография специалиста',
      width: 800,
      height: 1000,
    },
    approval: 'approved',
    photoConsent: true,
  },
];

export const approvedTestimonials: Testimonial[] = [
  {
    id: 'approved-testimonial-fixture',
    quote: 'Тестовый согласованный отзыв.',
    attribution: 'Тестовый автор',
    approval: 'approved',
    authorConsent: true,
  },
];

export const approvedContent = {
  contacts: approvedContacts,
  professionals: approvedProfessionals,
  testimonials: approvedTestimonials,
};
