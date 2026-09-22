import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const deploymentDoc = resolve(process.cwd(), 'docs/deployment-hoster-by.md');

describe('hoster.by deployment runbook', () => {
  it('documents the release, upload, HTTPS, canonical host, and verified 301 steps', () => {
    expect(existsSync(deploymentDoc)).toBe(true);

    const source = readFileSync(deploymentDoc, 'utf8');

    expect(source).toContain('npm run release:check');
    expect(source).toContain('dist/');
    expect(source).toContain('public_html/');
    expect(source).toContain('Lets Encrypt SSL');
    expect(source).toContain('ISPmanager');
    expect(source).toContain('301');
    expect(source).toContain('canonical');
    expect(source).toContain('www');
    expect(source).toContain(
      'https://hoster.by/help/ispmanager/kak-nastroit-pereadresatsiyu/',
    );
  });
});
