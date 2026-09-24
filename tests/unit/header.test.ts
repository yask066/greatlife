import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const headerPath = resolve(process.cwd(), 'src/components/Header.astro');
const logoPath = resolve(process.cwd(), 'public/images/logo-prekrasnaya-zhizn.png');

describe('site header branding', () => {
  it('renders the provided logo as the home link brand', () => {
    const source = readFileSync(headerPath, 'utf8');

    expect(existsSync(logoPath)).toBe(true);
    expect(source).toContain('<img');
    expect(source).toContain('src="/images/logo-prekrasnaya-zhizn.png"');
    expect(source).toContain('alt="Прекрасная жизнь"');
    expect(source).toContain('width: clamp(6rem, 10.5vw, 8.25rem);');
    expect(source).toContain('transform: translateX(-0.75rem);');
    expect(source).not.toContain('>Прекрасная жизнь</a>');
  });
});
