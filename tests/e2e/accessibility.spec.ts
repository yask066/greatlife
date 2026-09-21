import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const seriousOrCritical = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
  violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');

const expectAccessible = async (page: Page, state: string) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = seriousOrCritical(results.violations);

  expect(blockingViolations, `${state} has blocking accessibility violations`).toEqual([]);
};

const expectColorContrast = async (page: Page, state: string) => {
  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();

  expect(results.violations, `${state} has color contrast violations`).toEqual([]);
};

const expectFocusOutline = async (page: Page, label: string) => {
  const outline = await page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement)) return null;

    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });

  expect(outline, `${label} did not receive focus`).not.toBeNull();
  expect(outline?.outlineStyle, `${label} has no visible focus outline`).not.toBe('none');
  expect(outline?.outlineWidth, `${label} has a zero-width focus outline`).toBeGreaterThan(0);
};

test.describe('WCAG automated axe audit', () => {
  test('has no serious or critical violations on the default page', async ({ page }) => {
    await page.goto('/');

    await expectAccessible(page, 'default page');
    await expectColorContrast(page, 'default page');
  });

  test('has no serious or critical violations with the mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Открыть меню' }).click();
    await expect(page.locator('#primary-navigation')).toBeVisible();
    await expectAccessible(page, 'mobile menu open');
    await expectColorContrast(page, 'mobile menu open');
  });

  for (const direction of ['speech', 'psychology', 'bowls']) {
    test(`has no serious or critical violations for ${direction}`, async ({ page }) => {
      await page.goto('/');

      await page.locator(`#tab-${direction}`).click();
      await expect(page.locator(`#panel-${direction}`)).toBeVisible();
      await expectAccessible(page, `${direction} direction`);
      await expectColorContrast(page, `${direction} direction`);
    });
  }

  test('has no serious or critical violations with each FAQ answer open', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');

    const triggers = page.locator('[data-faq-trigger]');
    const triggerCount = await triggers.count();

    for (let index = 0; index < triggerCount; index += 1) {
      const trigger = triggers.nth(index);
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expectAccessible(page, `FAQ answer ${index + 1} open`);
      await expectColorContrast(page, `FAQ answer ${index + 1} open`);
    }
  });

  test('keeps a visible focus route from skip-link through final CTAs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    await expectFocusOutline(page, 'skip-link');
    await page.keyboard.press('Enter');

    const expectedStops = [
      '[data-page-block="header"]',
      '[data-page-block="directions"] [role="tab"]',
      '[data-page-block="faq"]',
    ];
    const visitedStops = new Set<string>();

    for (let index = 0; index < 100; index += 1) {
      await page.keyboard.press('Tab');

      const active = page.locator(':focus');
      if (await active.count() === 0) break;

      const isVisible = await active.isVisible();
      expect(isVisible, `tab stop ${index + 1} is hidden`).toBe(true);
      await expectFocusOutline(page, `tab stop ${index + 1}`);

      for (const selector of expectedStops) {
        if (await active.evaluate((element, stopSelector) => element.closest(stopSelector) !== null, selector)) {
          visitedStops.add(selector);
        }
      }

      if (await active.evaluate((element) => element === document.body)) break;
    }

    expect([...visitedStops]).toEqual(expect.arrayContaining(expectedStops));

    const ctaStops = page.locator(
      '[data-page-block="directions"] .contact-actions a, [data-page-block="final-cta"] .contact-actions a',
    );
    for (let index = 0; index < await ctaStops.count(); index += 1) {
      const cta = ctaStops.nth(index);
      await cta.focus();
      await expect(cta).toBeFocused();
      await expect(cta).toBeVisible();
      await expectFocusOutline(page, `CTA ${index + 1}`);
    }

    const chessPosition = await page.evaluate(() => {
      const directions = document.querySelector('[data-page-block="directions"]');
      const chess = document.querySelector('[data-page-block="chess-program"]');
      const faq = document.querySelector('[data-page-block="faq"]');

      if (!directions || !chess || !faq) return null;

      return {
        chessAfterDirections: Boolean(directions.compareDocumentPosition(chess) & Node.DOCUMENT_POSITION_FOLLOWING),
        chessBeforeFaq: Boolean(chess.compareDocumentPosition(faq) & Node.DOCUMENT_POSITION_FOLLOWING),
      };
    });

    expect(chessPosition).toEqual({ chessAfterDirections: true, chessBeforeFaq: true });
  });

  test('uses a complete heading hierarchy and named landmarks', async ({ page }) => {
    await page.goto('/');

    const semantics = await page.evaluate(() => {
      const headings = [...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')]
        .map((heading) => Number(heading.tagName.slice(1)));
      const headingIssues = headings.flatMap((level, index) => {
        if (index === 0) return level === 1 ? [] : [`first heading is h${level}`];
        return level > headings[index - 1] + 1
          ? [`h${level} follows h${headings[index - 1]}`]
          : [];
      });

      const landmarkSelectors = 'main, header, nav, aside, footer, section[aria-labelledby], [role="region"]';
      const unnamedLandmarks = [...document.querySelectorAll<HTMLElement>(landmarkSelectors)]
        .filter((landmark) => {
          if (landmark.getAttribute('aria-label')?.trim()) return false;

          const labelledBy = landmark.getAttribute('aria-labelledby');
          return !labelledBy || !document.getElementById(labelledBy)?.textContent?.trim();
        })
        .map((landmark) => landmark.tagName.toLowerCase());

      const imageIssues = [...document.images].flatMap((image) => {
        const decorative = image.getAttribute('aria-hidden') === 'true' || image.getAttribute('role') === 'presentation';
        const issues: string[] = [];

        if (decorative && image.alt !== '') issues.push('decorative image must have empty alt');
        if (!decorative && !image.alt.trim()) issues.push('content image must have non-empty alt');
        if (image.width <= 0 || image.height <= 0) issues.push('image must have positive dimensions');
        return issues;
      });

      return {
        headingCount: headings.filter((level) => level === 1).length,
        headingIssues,
        unnamedLandmarks,
        imageIssues,
      };
    });

    expect(semantics.headingCount, 'page must have exactly one h1').toBe(1);
    expect(semantics.headingIssues).toEqual([]);
    expect(semantics.unnamedLandmarks).toEqual([]);
    expect(semantics.imageIssues).toEqual([]);
  });
});
