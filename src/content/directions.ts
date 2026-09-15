import type { Direction } from '../types/content';

export const directions: Direction[] = [
  {
    id: 'speech',
    label: 'Речь',
    services: [
      {
        id: 'speech-diagnostics',
        title: 'Диагностика речи',
        description:
          'Первичная встреча для определения особенностей речи, коммуникации и возможных направлений дальнейшей работы.',
        audiences: ['teen', 'adult'],
      },
      {
        id: 'clear-confident-speech',
        title: 'Ясная и уверенная речь',
        description:
          'Занятия, направленные на понятность высказывания, уверенность в разговоре и более свободное выражение мыслей.',
        audiences: ['teen', 'adult'],
      },
      {
        id: 'communication-development',
        title: 'Развитие коммуникации',
        description:
          'Практика диалога, формулирования позиции, слушания собеседника и взаимодействия в разных ситуациях.',
        audiences: ['teen', 'adult'],
      },
      {
        id: 'public-speaking',
        title: 'Подготовка к публичным выступлениям',
        description:
          'Работа со структурой выступления, голосом, темпом речи и уверенностью перед аудиторией.',
        audiences: ['teen', 'adult'],
      },
    ],
  },
  {
    id: 'psychology',
    label: 'Психология',
    services: [
      {
        id: 'teen-world',
        title: 'Подросток и его мир',
        description:
          'Индивидуальная психологическая поддержка подростков в период изменений, сложностей в общении и поиска опоры.',
        audiences: ['teen'],
      },
      {
        id: 'adult-support',
        title: 'Поддержка для взрослых',
        description:
          'Индивидуальные консультации для взрослых, которым важно лучше понять себя, свои переживания и отношения с окружающими.',
        audiences: ['adult'],
      },
      {
        id: 'parent-child-dialogue',
        title: 'Диалог с ребёнком',
        description:
          'Консультации для родителей, помогающие лучше понимать подростка, выстраивать контакт и обсуждать сложные ситуации.',
        audiences: ['parent'],
      },
      {
        id: 'chess-thinking',
        title: 'Шахматы и мышление',
        description:
          'Групповая программа для развития памяти, логического мышления, внимания, навыков планирования и принятия решений.',
        audiences: ['teen'],
      },
    ],
  },
  {
    id: 'bowls',
    label: 'Поющие чаши',
    services: [
      {
        id: 'sound-relaxation',
        title: 'Звуковое расслабление',
        description:
          'Практика спокойного отдыха и переключения внимания с использованием звучания поющих чаш.',
        audiences: ['adult'],
      },
      {
        id: 'individual-practice',
        title: 'Индивидуальная практика',
        description:
          'Персональная встреча в спокойной обстановке с учётом комфортного для клиента темпа.',
        audiences: ['adult'],
      },
      {
        id: 'group-sound-meditation',
        title: 'Групповая звуковая медитация',
        description:
          'Совместная практика слушания и расслабления в небольшой группе.',
        audiences: ['adult'],
      },
      {
        id: 'inner-balance',
        title: 'Восстановление внутреннего равновесия',
        description:
          'Практика отдыха и внимательного отношения к своему состоянию без лечебных обещаний.',
        audiences: ['adult'],
      },
    ],
  },
];
