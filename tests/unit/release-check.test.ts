import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
) as {
  scripts?: Record<string, string>;
};

describe('release check', () => {
  it('runs the production gate, unit tests, e2e tests, and Lighthouse in order', () => {
    expect(packageJson.scripts?.['release:check']).toBe(
      'npm run build:production && npm run test:unit && npm run test:e2e && npm run test:lighthouse',
    );
  });
});
