import { expect, test } from '@playwright/test';

const navigationLinks = [
  ['Направления', '#directions'],
  ['О центре', '#about'],
  ['Специалисты', '#professionals'],
  ['Отзывы', '#testimonials'],
  ['Вопросы', '#faq'],
  ['Контакты', '#contacts'],
] as const;

test.describe('site navigation', () => {
  test('exposes the primary desktop anchor navigation', async ({ page }) => {
    await page.goto('/');

    const navigation = page.locator('#primary-navigation');
    await expect(navigation).toBeVisible();

    for (const [label, href] of navigationLinks) {
      await expect(navigation.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  });

  test('opens and closes the mobile menu with keyboard controls', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'Открыть меню' });
    const navigation = page.locator('#primary-navigation');

    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(navigation).toBeHidden();

    await menuButton.focus();
    await page.keyboard.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Закрыть меню' })).toBeFocused();
    await expect(navigation).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(navigation).toBeHidden();
    await expect(menuButton).toBeFocused();

    await page.keyboard.press('Space');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(navigation).toBeVisible();
  });

  test('closes after selecting a link and removes closed links from the tab order', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'Открыть меню' });
    const navigation = page.locator('#primary-navigation');

    await expect(navigation.locator('a')).toHaveCount(navigationLinks.length);
    await expect(navigation.locator('a').evaluateAll((links) => links.map((link) => link.tabIndex))).resolves.toEqual(
      navigationLinks.map(() => -1),
    );

    await menuButton.click();
    await navigation.getByRole('link', { name: 'О центре' }).click();

    await expect(page).toHaveURL(/#about$/);
    await expect(navigation).toBeHidden();
    await expect(menuButton).toBeFocused();
  });
});
