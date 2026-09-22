import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  editorialApprovalChecks,
  findEditorialApprovalIssues,
} from '../../src/lib/editorial-approval';

const approvalDocument = readFileSync('docs/content-approval.md', 'utf8');

describe('editorial approval checklist', () => {
  it('declares every release-blocking editorial confirmation', () => {
    const issues = findEditorialApprovalIssues(approvalDocument);

    expect(editorialApprovalChecks).toHaveLength(9);
    expect(issues.map((issue) => issue.id)).toEqual(
      expect.arrayContaining([
        'services-list',
        'service-texts',
        'chess-copy',
        'bowls-copy',
        'professional-profiles',
        'testimonials',
        'photo-rights',
      ]),
    );
    expect(issues.map((issue) => issue.id)).not.toEqual(
      expect.arrayContaining(['phone', 'telegram']),
    );
  });

  it('accepts a checklist only when every required item is confirmed', () => {
    const approvedDocument = editorialApprovalChecks
      .map((check) => `- [x] \`${check.id}\` — ${check.label}`)
      .join('\n');

    expect(findEditorialApprovalIssues(approvedDocument)).toEqual([]);
  });
});
