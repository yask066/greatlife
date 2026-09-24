import { expect, test } from '@playwright/test';

const directions = ['speech', 'psychology', 'bowls'] as const;

test.describe('direction tabs', () => {
  test('shows psychology by default with a textual active marker', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveText(/Психология.*выбрано/u);
    await expect(page.locator('#panel-psychology')).toBeVisible();
    await expect(page.locator('#panel-speech')).toBeHidden();
  });

  test('shows service cards without list markers or default list padding', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#panel-psychology .card-grid')).toHaveCSS('list-style-type', 'none');
    await expect(page.locator('#panel-psychology .card-grid')).toHaveCSS('padding-left', '0px');
  });

  test('changes the active direction with a mouse click without reloading', async ({ page }) => {
    await page.goto('/');
    const speechTab = page.locator('#tab-speech');

    await speechTab.click();

    await expect(page).toHaveURL(/#speech$/);
    await expect(speechTab).toHaveAttribute('aria-selected', 'true');
    await expect(speechTab).toHaveText(/Речь.*выбрано/u);
    await expect(page.locator('#panel-speech')).toBeVisible();
    await expect(page.locator('#panel-psychology')).toBeHidden();
  });

  test('supports Tab, Enter, Space and arrow-key navigation', async ({ page }) => {
    await page.goto('/');
    const psychologyTab = page.locator('#tab-psychology');

    await page.keyboard.press('Tab');
    await expect(psychologyTab).toHaveAttribute('tabindex', '0');
    await psychologyTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#tab-bowls')).toBeFocused();
    await expect(page).toHaveURL(/#bowls$/);

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#tab-psychology')).toBeFocused();
    await page.locator('#tab-bowls').focus();
    await page.keyboard.press('Space');
    await expect(page).toHaveURL(/#bowls$/);

    await page.locator('#tab-speech').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#speech$/);
  });

  for (const id of directions) {
    test(`activates ${id} from a direct hash and after reload`, async ({ page }) => {
      await page.goto(`/#${id}`);
      await expect(page.locator(`#tab-${id}`)).toHaveAttribute('aria-selected', 'true');
      await page.reload();
      await expect(page.locator(`#tab-${id}`)).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator(`#panel-${id}`)).toBeVisible();
    });
  }
});
