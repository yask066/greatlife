import { expect, test } from '@playwright/test';

const viewportWidths = [320, 360, 768, 1024, 1440];

test.describe('responsive layout at control widths', () => {
  for (const width of viewportWidths) {
    test(`keeps the ${width}px layout inside the viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);

      const activeTab = page.locator('[role="tab"][aria-selected="true"]');
      await expect(activeTab).toBeVisible();
      await expect(activeTab).toBeInViewport();

      const interactiveSizes = await page.locator(
        '.button, button, [role="tab"], nav a, summary',
      ).evaluateAll((elements) => elements
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden';
        })
        .map((element) => {
          const { width: elementWidth, height: elementHeight } = element.getBoundingClientRect();
          return {
            selector: element.tagName.toLowerCase(),
            width: elementWidth,
            height: elementHeight,
          };
        }));

      expect(interactiveSizes.length).toBeGreaterThan(0);
      expect(interactiveSizes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
        ]),
      );
      for (const size of interactiveSizes) {
        expect(size.width, `${size.selector} is narrower than 44px at ${width}px`).toBeGreaterThanOrEqual(44);
        expect(size.height, `${size.selector} is shorter than 44px at ${width}px`).toBeGreaterThanOrEqual(44);
      }

      const stickyOverlap = await page.evaluate(async () => {
        const sticky = document.querySelector<HTMLElement>('[data-page-block="mobile-contact-bar"]');
        const footer = document.querySelector<HTMLElement>('[data-page-block="footer"]');
        const finalCta = document.querySelector<HTMLElement>('[data-page-block="final-cta"]');

        if (!sticky || !footer || !finalCta || getComputedStyle(sticky).display === 'none') {
          return false;
        }

        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        const stickyRect = sticky.getBoundingClientRect();
        const overlaps = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect();
          return rect.left < stickyRect.right && rect.right > stickyRect.left &&
            rect.top < stickyRect.bottom && rect.bottom > stickyRect.top;
        };

        return overlaps(footer) || overlaps(finalCta);
      });

      expect(stickyOverlap, `sticky contact panel overlaps content at ${width}px`).toBe(false);
    });
  }
});
