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

const chessSkills = [
  'Память',
  'Логическое мышление',
  'Концентрацию',
  'Скорость принятия решений',
  'Когнитивную активность',
];

const informationalSections = [
  'О центре',
  'Кому подходят занятия',
  'Как проходят встречи',
];

const namedMethodClaims = ['КПТ', 'арт-терапия'];

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

test('renders the complete chess program without JavaScript', async ({ baseURL, browser }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/');

    const chessProgram = page.locator('#chess-program');
    await expect(chessProgram).toBeVisible();

    for (const skill of chessSkills) {
      await expect(chessProgram.getByRole('listitem').filter({ hasText: skill })).toBeVisible();
    }

    await expect(chessProgram).toContainText(
      'Шахматная группа — это небольшой безопасный социум. Здесь подростки учатся взаимодействовать, соблюдать общие правила, уважать соперника, справляться с проигрышем и замечать, как их решения влияют на результат.',
    );
  } finally {
    await context.close();
  }
});

test('renders informational sections without JavaScript', async ({ baseURL, browser }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  try {
    await page.goto('/');

    const about = page.locator('#about');
    const audience = page.locator('#audience');
    const format = page.locator('#format');

    await expect(about).toBeVisible();
    await expect(audience).toBeVisible();
    await expect(format).toBeVisible();

    await expect(about.getByRole('heading', { level: 2, name: 'О центре', exact: true })).toBeVisible();
    await expect(
      audience.getByRole('heading', { level: 2, name: 'Кому подходят занятия', exact: true }),
    ).toBeVisible();
    await expect(
      format.getByRole('heading', { level: 2, name: 'Как проходят встречи', exact: true }),
    ).toBeVisible();

    for (const audienceGroup of ['Подросткам', 'Родителям', 'Взрослым']) {
      await expect(
        audience.getByRole('heading', { level: 3, name: audienceGroup, exact: true }),
      ).toBeVisible();
    }

    await expect(format).toContainText('Очные встречи в Минске');
    await expect(format).toContainText('индивидуальный');
    await expect(format).toContainText('групповой');

    const informationalText = await page.locator('#about, #audience, #format').allInnerTexts();
    const renderedText = informationalText.join(' ');

    expect(renderedText).not.toMatch(/(?:цена|стоимость|\d+\s*(?:руб\.?|byn|р\.))/i);
    expect(renderedText).not.toMatch(
      /(?<![\p{L}\p{N}])(?:\d+\s*)?(?:минут(?:а|ы)?|час(?:а|ов)?)(?![\p{L}\p{N}])/iu,
    );
    expect(renderedText).not.toMatch(
      /(?<![\p{L}\p{N}])(?:ул\.?|улица|проспект|пр-т|дом)(?![\p{L}\p{N}])/iu,
    );
    expect(renderedText).not.toMatch(/(?:метод|методика|методики)/i);

    for (const namedMethodClaim of namedMethodClaims) {
      expect(renderedText).not.toContain(namedMethodClaim);
    }
  } finally {
    await context.close();
  }
});
