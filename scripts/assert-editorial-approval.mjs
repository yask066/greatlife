import { readFile } from 'node:fs/promises';

import { assertEditorialApproval } from '../src/lib/editorial-approval.ts';

const approvalDocument = await readFile(
  new URL('../docs/content-approval.md', import.meta.url),
  'utf8',
);

try {
  assertEditorialApproval(approvalDocument);
  console.log('Editorial content approval passed.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
