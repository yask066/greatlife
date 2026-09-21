import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

const seriousOrCritical = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) =>
  violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');

const expectAccessible = async (page: Page, state: string) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = seriousOrCritical(results.violations);

  expect(blockingViolations, `${state} has blocking accessibility violations`).toEqual([]);
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
});
