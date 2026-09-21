import { expect, test } from '@playwright/test';
import { contacts } from '../../src/content/contacts';

test.describe('consistent contact actions', () => {
  test('uses one shared phone and Telegram target across the conversion path', async ({ page }) => {
    await page.goto('/');

    const phones = page.locator('[data-contact-kind="phone"]');
    const telegramLinks = page.locator('[data-contact-kind="telegram"]');

    await expect(phones).not.toHaveCount(0);
    await expect(telegramLinks).not.toHaveCount(0);
    await expect(phones.evaluateAll((links, href) => links.every((link) => link.getAttribute('href') === href), contacts.phoneHref)).resolves.toBe(true);
    await expect(
      telegramLinks.evaluateAll(
        (links, href) => links.every((link) =>
          link.getAttribute('href') === href &&
          link.getAttribute('target') === '_blank' &&
          link.getAttribute('rel') === 'noopener noreferrer'
        ),
        contacts.telegramHref,
      ),
    ).resolves.toBe(true);
    await expect(page.locator('#contacts')).toContainText(contacts.phoneDisplay);

    for (const placement of ['directions', 'contacts', 'final']) {
      await expect(page.locator(`#contact-phone-${placement}`)).toBeVisible();
      await expect(page.locator(`#contact-telegram-${placement}`)).toBeVisible();
    }
  });

  test('keeps the mobile contact bar visible only on mobile without covering page content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-page-block="mobile-contact-bar"]')).toBeHidden();

    await page.setViewportSize({ width: 360, height: 800 });
    await page.reload();

    const mobileLayout = await page.locator('[data-page-block="mobile-contact-bar"]').evaluate((bar) => {
      const rootStyles = getComputedStyle(document.documentElement);
      const bodyStyles = getComputedStyle(document.body);
      const barStyles = getComputedStyle(bar);
      const styleText = [...document.styleSheets]
        .flatMap((sheet) => {
          try {
            return [...(sheet.cssRules ?? [])].map((rule) => rule.cssText);
          } catch {
            return [];
          }
        })
        .join('\n');

      return {
        barDisplay: barStyles.display,
        barPosition: barStyles.position,
        barHeight: rootStyles.getPropertyValue('--mobile-contact-bar-height').trim(),
        bodyPaddingBottom: bodyStyles.paddingBottom,
        hasSafeAreaInset: styleText.includes('env(safe-area-inset-bottom)'),
      };
    });

    expect(mobileLayout).toMatchObject({
      barDisplay: 'block',
      barPosition: 'fixed',
      barHeight: '7.5rem',
      hasSafeAreaInset: true,
    });
    expect(Number.parseFloat(mobileLayout.bodyPaddingBottom)).toBeGreaterThanOrEqual(80);
  });
});
