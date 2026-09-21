import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

const seriousOrCritical = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
  violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');

const expectAccessible = async (page: Page, state: string) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = seriousOrCritical(results.violations);

  expect(blockingViolations, `${state} has blocking accessibility violations`).toEqual([]);
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
  });

  test('has no serious or critical violations with the mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Открыть меню' }).click();
    await expect(page.locator('#primary-navigation')).toBeVisible();
    await expectAccessible(page, 'mobile menu open');
  });

  for (const direction of ['speech', 'psychology', 'bowls']) {
    test(`has no serious or critical violations for ${direction}`, async ({ page }) => {
      await page.goto('/');

      await page.locator(`#tab-${direction}`).click();
      await expect(page.locator(`#panel-${direction}`)).toBeVisible();
      await expectAccessible(page, `${direction} direction`);
    });
  }

  test('has no serious or critical violations with each FAQ answer open', async ({ page }) => {
    await page.goto('/');

    const triggers = page.locator('[data-faq-trigger]');
    const triggerCount = await triggers.count();

    for (let index = 0; index < triggerCount; index += 1) {
      const trigger = triggers.nth(index);
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expectAccessible(page, `FAQ answer ${index + 1} open`);
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
      '[data-page-block="directions"] .contact-actions',
      '[data-page-block="faq"]',
      '[data-page-block="final-cta"]',
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
});
