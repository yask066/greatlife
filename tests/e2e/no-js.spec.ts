import { expect, test } from '@playwright/test';

const heroContent = [
  'Прекрасная жизнь',
  'Центр психологии и речи',
  'Профессиональная поддержка рядом',
  'Помогаем подросткам и взрослым лучше понимать себя, свободнее общаться и раскрывать свои возможности',
  'Очные занятия в Минске',
];

const directionNames = ['Речь', 'Психология', 'Поющие чаши'];

const serviceNames = [
  'Диагностика речи',
  'Ясная и уверенная речь',
  'Развитие коммуникации',
  'Подготовка к публичным выступлениям',
  'Подросток и его мир',
  'Поддержка для взрослых',
  'Диалог с ребёнком',
  'Шахматы и мышление',
  'Звуковое расслабление',
  'Индивидуальная практика',
  'Групповая звуковая медитация',
  'Восстановление внутреннего равновесия',
];

const chessGroupContent = [
  'Шахматы и мышление',
  'Группа как мини-социум',
  'Шахматная группа — это небольшой безопасный социум. Здесь подростки учатся взаимодействовать, соблюдать общие правила, уважать соперника, справляться с проигрышем и замечать, как их решения влияют на результат.',
];

const informationalSections = [
  'О центре',
  'Кому подходят занятия',
  'Как проходят встречи',
];

test('keeps all key content visible when JavaScript is disabled', async ({
  baseURL,
  browser,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  try {
    await page.goto('/');

    const visiblePageText = await page.locator('body').innerText();
    const requiredContent = [
      ...heroContent,
      ...directionNames,
      ...serviceNames,
      ...chessGroupContent,
      ...informationalSections,
    ];

    for (const content of requiredContent) {
      expect.soft(visiblePageText, `Missing visible no-JS content: ${content}`).toContain(content);
    }

    for (const sectionName of informationalSections) {
      await expect.soft(
        page.getByRole('heading', { name: sectionName, exact: true }),
        `Missing no-JS section heading: ${sectionName}`,
      ).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
