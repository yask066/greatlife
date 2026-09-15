import { describe, expect, it } from 'vitest';

import { directions } from '../../src/content/directions';

describe('service directions', () => {
  it('publishes the exact PRD catalog with explicit audience targeting', () => {
    expect(
      directions.map(({ id, label, services }) => ({
        id,
        label,
        services: services.map(({ title, description, audiences }) => ({
          title,
          description,
          audiences,
        })),
      })),
    ).toEqual([
      {
        id: 'speech',
        label: 'Речь',
        services: [
          {
            title: 'Диагностика речи',
            description:
              'Первичная встреча для определения особенностей речи, коммуникации и возможных направлений дальнейшей работы.',
            audiences: ['teen', 'adult'],
          },
          {
            title: 'Ясная и уверенная речь',
            description:
              'Занятия, направленные на понятность высказывания, уверенность в разговоре и более свободное выражение мыслей.',
            audiences: ['teen', 'adult'],
          },
          {
            title: 'Развитие коммуникации',
            description:
              'Практика диалога, формулирования позиции, слушания собеседника и взаимодействия в разных ситуациях.',
            audiences: ['teen', 'adult'],
          },
          {
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
            title: 'Подросток и его мир',
            description:
              'Индивидуальная психологическая поддержка подростков в период изменений, сложностей в общении и поиска опоры.',
            audiences: ['teen'],
          },
          {
            title: 'Поддержка для взрослых',
            description:
              'Индивидуальные консультации для взрослых, которым важно лучше понять себя, свои переживания и отношения с окружающими.',
            audiences: ['adult'],
          },
          {
            title: 'Диалог с ребёнком',
            description:
              'Консультации для родителей, помогающие лучше понимать подростка, выстраивать контакт и обсуждать сложные ситуации.',
            audiences: ['parent'],
          },
          {
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
            title: 'Звуковое расслабление',
            description:
              'Практика спокойного отдыха и переключения внимания с использованием звучания поющих чаш.',
            audiences: ['adult'],
          },
          {
            title: 'Индивидуальная практика',
            description:
              'Персональная встреча в спокойной обстановке с учётом комфортного для клиента темпа.',
            audiences: ['adult'],
          },
          {
            title: 'Групповая звуковая медитация',
            description:
              'Совместная практика слушания и расслабления в небольшой группе.',
            audiences: ['adult'],
          },
          {
            title: 'Восстановление внутреннего равновесия',
            description:
              'Практика отдыха и внимательного отношения к своему состоянию без лечебных обещаний.',
            audiences: ['adult'],
          },
        ],
      },
    ]);
  });

  it('uses a unique non-empty identifier for every service', () => {
    const ids = directions.flatMap(({ services }) =>
      services.map(({ id }) => id),
    );

    expect(ids).toHaveLength(12);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
