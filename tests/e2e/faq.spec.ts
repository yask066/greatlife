import { expect, test } from '@playwright/test';

const questions = [
  'Кому подходят занятия?',
  'Как выбрать направление?',
  'Как проходит первая встреча?',
  'Работают ли специалисты с подростками?',
  'Где находится центр?',
  'Как записаться?',
] as const;

test.describe('FAQ disclosures', () => {
  test('renders all six questions and opens one answer with a mouse', async ({ page }) => {
    await page.goto('/');

    const triggers = page.locator('[data-faq-trigger]');
    await expect(triggers).toHaveCount(questions.length);

    for (const question of questions) {
      await expect(page.getByRole('button', { name: question, exact: true })).toBeVisible();
    }

    const trigger = page.getByRole('button', { name: questions[0], exact: true });
    const answerId = await trigger.getAttribute('aria-controls');
    expect(answerId).toBeTruthy();
    const answer = page.locator(`#${answerId}`);

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(answer).toBeHidden();

    await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(answer).toBeVisible();
  });

  test('opens answers with Enter and Space without closing another answer', async ({ page }) => {
    await page.goto('/');

    const first = page.getByRole('button', { name: questions[0], exact: true });
    const second = page.getByRole('button', { name: questions[1], exact: true });
    const firstAnswer = page.locator(`#${await first.getAttribute('aria-controls')}`);
    const secondAnswer = page.locator(`#${await second.getAttribute('aria-controls')}`);

    await first.focus();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(firstAnswer).toBeVisible();

    await second.focus();
    await page.keyboard.press('Space');
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(secondAnswer).toBeVisible();
    await expect(firstAnswer).toBeVisible();
  });

  test('updates disclosure state when the button is activated programmatically', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button', { name: questions[2], exact: true });
    const answer = page.locator(`#${await trigger.getAttribute('aria-controls')}`);

    await trigger.evaluate((button) => (button as HTMLElement).click());

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(answer).toBeVisible();
  });

  test('keeps every answer readable when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('/');

    for (const question of questions) {
      const trigger = page.getByRole('button', { name: question, exact: true });
      const answerId = await trigger.getAttribute('aria-controls');
      await expect(page.locator(`#${answerId}`)).toBeVisible();
    }

    await context.close();
  });
});
