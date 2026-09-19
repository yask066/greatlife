import { assertProductionReady } from '../src/lib/production-ready.ts';
import { contacts } from '../src/content/contacts.ts';
import { professionals, testimonials } from '../src/content/trust.ts';

try {
  assertProductionReady({ contacts, professionals, testimonials });
  console.log('Production content approval passed.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
