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

test.describe('mobile-first grid contract', () => {
  for (const width of viewportWidths) {
    test(`uses the planned grid density at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const layout = await page.evaluate(() => ({
        sections: document.querySelectorAll('.section').length,
        containers: [...document.querySelectorAll<HTMLElement>('.container')].map((element) => {
          const rect = element.getBoundingClientRect();
          return { width: rect.width, left: rect.left, right: rect.right };
        }),
        grids: [...document.querySelectorAll<HTMLElement>('.card-grid')]
          .map((grid) => {
            const gridRect = grid.getBoundingClientRect();
            if (gridRect.width === 0 || gridRect.height === 0) {
              return null;
            }

            const leftEdges = [...grid.children]
              .map((item) => Math.round(item.getBoundingClientRect().left));

            return {
              className: grid.className,
              columns: new Set(leftEdges).size,
              items: grid.children.length,
            };
          })
          .filter((grid) => grid !== null)
          .filter((grid) => grid.items > 1),
      }));

      expect(layout.sections, 'page sections should use the shared section class').toBeGreaterThan(0);
      expect(layout.containers, 'page content should use the shared container class').not.toHaveLength(0);
      expect(layout.grids, 'repeated content should use the shared card-grid class').not.toHaveLength(0);

      for (const grid of layout.grids) {
        if (width < 768) {
          expect(grid.columns, `${grid.className} has unexpected density at ${width}px`).toBe(1);
        } else {
          expect(grid.columns).toBeGreaterThanOrEqual(2);
        }
      }

      if (width >= 1440) {
        for (const container of layout.containers) {
          expect(container.width).toBeLessThanOrEqual(1200);
          expect(container.left).toBeGreaterThanOrEqual(0);
          expect(container.right).toBeLessThanOrEqual(width);
        }
      }
    });
  }
});
