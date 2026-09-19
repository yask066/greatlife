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
});
