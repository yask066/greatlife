import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

test('keeps the active services summary aligned with the shared content container', async () => {
  const page = await readFile('src/pages/index.astro', 'utf8');

  expect(page).toMatch(/<section\s+class="container"\s+data-page-block="services"/u);
});
