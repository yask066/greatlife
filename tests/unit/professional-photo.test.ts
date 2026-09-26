import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const componentPath = resolve(process.cwd(), 'src/components/Professionals.astro');
const stylesPath = resolve(process.cwd(), 'src/styles/global.css');

describe('professional photo sizing', () => {
  it('keeps professional photos at 190 by 190 pixels', () => {
    const component = readFileSync(componentPath, 'utf8');
    const styles = readFileSync(stylesPath, 'utf8');
    const photoStyles = styles.match(/\.professional-photo\s*\{([\s\S]*?)\n\}/u)?.[1] ?? '';

    expect(component.match(/class="professional-photo"/gu)).toHaveLength(2);
    expect(photoStyles).toContain('width: 190px;');
    expect(photoStyles).toContain('height: 190px;');
  });
});
