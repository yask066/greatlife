import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = resolve(process.cwd(), 'src/components/ContactActions.astro');

describe('ContactActions component contract', () => {
  it('uses the shared contacts module and renders labelled phone and Telegram actions', async () => {
    const source = await readFile(componentPath, 'utf8');

    expect(source).toContain("import { contacts } from '../content/contacts';");
    expect(source).toContain('Позвонить');
    expect(source).toContain('Написать в Telegram');
    expect(source).toContain('data-contact-kind="phone"');
    expect(source).toContain('data-contact-kind="telegram"');
    expect(source).toContain('contact-phone-${placement}');
    expect(source).toContain('contact-telegram-${placement}');
    expect(source).not.toMatch(/tel:|https:\/\/t\.me\//);
  });
});
