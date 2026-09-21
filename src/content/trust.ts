import type { Professional, Testimonial } from '../types/content';

export const professionals: Professional[] = [
  {
    id: 'temporary-professional-template',
    name: 'Имя специалиста (шаблон)',
    role: 'Должность / роль (шаблон)',
    focus: ['Направление работы (шаблон)'],
    qualification:
      'Подтверждённая квалификация будет добавлена после согласования.',
    photo: {
      src: '/images/minipekka.jpg',
      alt: 'Временная фотография специалиста; заменить перед публикацией',
      width: 761,
      height: 761,
    },
    approval: 'demo',
    photoConsent: true,
  },
];

export const testimonials: Testimonial[] = [];

export const professionalsEmptyState =
  'Профили специалистов готовятся к публикации после согласования.';

export const testimonialsEmptyState =
  'Отзывы готовятся к публикации после получения разрешений авторов.';
