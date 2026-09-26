import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

test('gives the green information sections horizontal inner spacing', async () => {
  const styles = await readFile('src/styles/global.css', 'utf8');
  const sageSection = styles.match(/\.section--sage\s*\{([\s\S]*?)\n\}/u)?.[1] ?? '';

  expect(sageSection).toContain('padding-inline: var(--container-gutter);');
});
