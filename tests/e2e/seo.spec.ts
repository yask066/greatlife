import { expect, test } from '@playwright/test';

const approvedTitle = 'Прекрасная жизнь — центр психологии и речи в Минске';
const approvedDescription =
  'Очные психологические консультации, развитие речи, шахматные занятия для подростков и практики с поющими чашами в Минске';
const approvedPhone = '+375 (29) 123-45-67';
const approvedTelegram = 'https://t.me/nickname';
const metadataTimeout = 1_000;

test.describe('SEO head and document semantics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('publishes the approved Russian metadata and a single page heading', async ({
    page,
  }) => {
    await expect.soft(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect.soft(page.locator('h1')).toHaveCount(1);
    await expect.soft(page).toHaveTitle(approvedTitle, {
      timeout: metadataTimeout,
    });
    await expect
      .soft(page.locator('meta[name="description"]'))
      .toHaveAttribute('content', approvedDescription, {
        timeout: metadataTimeout,
      });
    await expect
      .soft(page.locator('link[rel="canonical"]'))
      .toHaveAttribute('href', `${process.env.SITE_URL ?? 'https://example.invalid'}/`, {
        timeout: metadataTimeout,
      });
    await expect
      .soft(page.locator('meta[property="og:title"]'))
      .toHaveAttribute('content', approvedTitle, {
        timeout: metadataTimeout,
      });
    await expect
      .soft(page.locator('meta[property="og:description"]'))
      .toHaveAttribute('content', approvedDescription, {
        timeout: metadataTimeout,
      });
  });

  test('publishes crawlable SEO artifacts and production-safe organization JSON-LD', async ({
    page,
  }) => {
    const [robotsResponse, sitemapResponse] = await Promise.all([
      page.request.get('/robots.txt'),
      page.request.get('/sitemap.xml'),
    ]);

    expect(robotsResponse.status()).toBe(200);
    expect(sitemapResponse.status()).toBe(200);

    const robots = await robotsResponse.text();
    const sitemap = await sitemapResponse.text();
    const configuredSiteUrl = process.env.SITE_URL ?? 'https://example.invalid';

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain(`Sitemap: ${configuredSiteUrl}/sitemap.xml`);
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain(`<loc>${configuredSiteUrl}/</loc>`);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`${configuredSiteUrl}/`);
    if (process.env.SITE_URL) {
      expect(canonical).not.toContain('example.invalid');
    }

    const organization = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent ?? '{}'))
          .find((value) => value['@type'] === 'Organization'),
    );

    expect(organization).toMatchObject({
      '@type': 'Organization',
      name: approvedTitle,
      url: `${configuredSiteUrl}/`,
      telephone: approvedPhone,
      address: { addressLocality: 'Минск' },
      sameAs: [approvedTelegram],
    });
  });

  test('exposes a focusable skip link to the main content', async ({ page }) => {
    const skipLink = page.getByRole('link', {
      name: 'Перейти к основному содержанию',
    });

    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toHaveCount(1);

    await skipLink.focus();

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
  });
});

test('renders the approved local typography and visual foundation without external fonts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });

  const externalFontRequests: string[] = [];
  const siteOrigin = 'http://127.0.0.1:4321';

  page.on('request', (request) => {
    const requestUrl = request.url();
    if (request.resourceType() === 'font' && new URL(requestUrl).origin !== siteOrigin) {
      externalFontRequests.push(requestUrl);
    }
  });

  await page.goto('/');

  const styles = await page.locator('html').evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const properties = [
      '--color-primary',
      '--color-accent',
      '--color-sage',
      '--color-background',
      '--color-text',
      '--color-surface',
      '--container-max',
      '--container-gutter',
      '--space-1',
      '--space-2',
      '--space-3',
      '--space-4',
      '--space-5',
      '--space-6',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
      '--radius-pill',
      '--shadow-card',
      '--shadow-elevated',
      '--font-size-body',
      '--font-size-heading-sm',
      '--font-size-heading-md',
      '--font-size-heading-lg',
    ];

    return {
      tokens: Object.fromEntries(
        properties.map((property) => [property, root.getPropertyValue(property).trim()]),
      ),
      body: {
        backgroundColor: body.backgroundColor,
        color: body.color,
        fontFamily: body.fontFamily,
        fontSize: body.fontSize,
      },
    };
  });

  expect(styles.tokens).toMatchObject({
    '--color-primary': '#1f5c50',
    '--color-accent': '#2b6d64',
    '--color-sage': '#dce9e4',
    '--color-background': '#f4f8f6',
    '--color-text': '#17334a',
    '--color-surface': '#fff',
    '--container-max': '75rem',
    '--container-gutter': 'clamp(1rem, 4vw, 2rem)',
    '--space-1': '.5rem',
    '--space-2': '.75rem',
    '--space-3': '1rem',
    '--space-4': '1.5rem',
    '--space-5': '2rem',
    '--space-6': '3rem',
    '--radius-sm': '.5rem',
    '--radius-md': '1rem',
    '--radius-lg': '1.5rem',
    '--radius-pill': '999px',
    '--font-size-body': '1rem',
  });
  expect(styles.tokens['--shadow-card']).toContain('#17334a');
  expect(styles.tokens['--shadow-elevated']).toContain('#17334a');
  expect(styles.tokens['--font-size-heading-sm']).not.toBe('');
  expect(styles.tokens['--font-size-heading-md']).not.toBe('');
  expect(styles.tokens['--font-size-heading-lg']).not.toBe('');
  expect(styles.body).toMatchObject({
    backgroundColor: 'rgb(244, 248, 246)',
    color: 'rgb(23, 51, 74)',
  });
  expect(styles.body.fontFamily).toMatch(/^Manrope[, ]/);
  expect(Number.parseFloat(styles.body.fontSize)).toBeGreaterThanOrEqual(16);

  const font = await page.request.get('/fonts/manrope-latin-cyrillic.woff2');
  expect(font.status()).toBe(200);
  expect((await font.body()).subarray(0, 4).toString('ascii')).toBe('wOF2');
  expect(externalFontRequests).toEqual([]);
});

test.describe('global accessibility foundation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows a strong focus indicator for keyboard navigation', async ({ page }) => {
    await page.locator('body').evaluate((body) => {
      const button = document.createElement('button');
      button.textContent = 'Проверить фокус';
      body.append(button);
    });

    const button = page.getByRole('button', { name: 'Проверить фокус' });
    await button.focus();

    const focusIndicator = await button.evaluate((element) => {
      const style = getComputedStyle(element);

      return {
        color: style.outlineColor,
        focusVisible: element.matches(':focus-visible'),
        offset: Number.parseFloat(style.outlineOffset),
        style: style.outlineStyle,
        width: Number.parseFloat(style.outlineWidth),
      };
    });

    expect(focusIndicator).toEqual({
      color: 'rgb(23, 51, 74)',
      focusVisible: true,
      offset: 3,
      style: 'solid',
      width: 3,
    });
  });

  test('keeps primary actions at least 44 pixels tall', async ({ page }) => {
    await page.locator('body').evaluate((body) => {
      const link = document.createElement('a');
      link.dataset.accessibilityProbe = 'true';
      link.className = 'button';
      link.href = '#main-content';
      link.textContent = 'Основное действие';

      const button = document.createElement('button');
      button.dataset.accessibilityProbe = 'true';
      button.textContent = 'Кнопка';

      body.append(link, button);
    });

    const heights = await page.locator('[data-accessibility-probe="true"]').evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );

    expect(heights).toHaveLength(2);
    expect(heights.every((height) => height >= 44)).toBe(true);
  });

  test('offsets anchored sections from sticky page controls', async ({ page }) => {
    await page.locator('main').evaluate((main) => {
      const section = document.createElement('section');
      section.id = 'anchor-probe';
      main.append(section);
    });

    const scrollMarginTop = await page
      .locator('#anchor-probe')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).scrollMarginTop));

    expect(scrollMarginTop).toBeGreaterThanOrEqual(64);
  });

  test('removes optional motion when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('body').evaluate((body) => {
      const probe = document.createElement('div');
      probe.style.animationDuration = '2s';
      probe.style.transitionDuration = '2s';
      body.append(probe);
    });

    const durations = await page.locator('body > div').evaluate((element) => {
      const style = getComputedStyle(element);

      return {
        animation: Number.parseFloat(style.animationDuration),
        transition: Number.parseFloat(style.transitionDuration),
      };
    });

    expect(durations.animation).toBeLessThanOrEqual(0.01);
    expect(durations.transition).toBeLessThanOrEqual(0.01);
  });
});
