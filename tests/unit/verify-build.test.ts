import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const scriptPath = resolve(process.cwd(), 'scripts/verify-build.mjs');

function createDistFixture() {
  const dist = mkdtempSync(join(tmpdir(), 'prekrasnaya-zhizn-dist-'));

  mkdirSync(join(dist, 'fonts'));
  mkdirSync(join(dist, 'scripts'));
  writeFileSync(
    join(dist, 'index.html'),
    [
      '<link rel="icon" href="/favicon.svg">',
      '<link rel="stylesheet" href="/styles.css">',
      '<script src="/scripts/main.js"></script>',
      '<a href="/#main-content">Главная</a>',
      '<a href="https://example.com">Внешняя</a>',
      '<a href="tel:+375290000000">Телефон</a>',
      '<a href="https://t.me/example">Telegram</a>',
      '<a href="#section">Якорь</a>',
    ].join(''),
  );
  writeFileSync(join(dist, 'robots.txt'), 'User-agent: *');
  writeFileSync(join(dist, 'sitemap.xml'), '<urlset />');
  writeFileSync(join(dist, 'favicon.svg'), '<svg />');
  writeFileSync(join(dist, 'styles.css'), 'body {}');
  writeFileSync(join(dist, 'scripts', 'main.js'), '');
  writeFileSync(join(dist, 'fonts', 'manrope-latin-cyrillic.woff2'), 'font');

  return dist;
}

function runVerifier(dist: string) {
  return () => execFileSync(process.execPath, [scriptPath, dist], { encoding: 'utf8' });
}

describe('verify-build', () => {
  test('accepts a complete dist and ignores external, tel, hash, and Telegram URLs', () => {
    expect(runVerifier(createDistFixture())).not.toThrow();
  });

  test('reports missing required files and broken internal links', () => {
    const dist = createDistFixture();
    unlinkSync(join(dist, 'favicon.svg'));
    writeFileSync(join(dist, 'index.html'), '<a href="/missing.html">Broken</a>');

    expect(runVerifier(dist)).toThrow(/Missing required file: favicon\.svg/);
    expect(runVerifier(dist)).toThrow(/Broken internal link in index\.html: \/missing\.html/);
  });
});
