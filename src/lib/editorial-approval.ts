export const editorialApprovalChecks = [
  { id: 'services-list', label: 'Перечень услуг' },
  { id: 'service-texts', label: 'Тексты услуг' },
  { id: 'chess-copy', label: 'Шахматные формулировки' },
  { id: 'bowls-copy', label: 'Тексты поющих чаш' },
  { id: 'professional-profiles', label: 'Профили специалистов' },
  { id: 'testimonials', label: 'Отзывы' },
  { id: 'photo-rights', label: 'Права на фотографии' },
  { id: 'phone', label: 'Телефон' },
  { id: 'telegram', label: 'Telegram' },
] as const;

export interface EditorialApprovalIssue {
  id: string;
  label: string;
  reason: 'missing' | 'pending';
}

function findChecklistStatus(markdown: string, id: string): 'approved' | 'pending' | 'missing' {
  const marker = markdown.match(
    new RegExp('^- \\[([ xX])\\] `' + id + '`(?:\\s|—)', 'm'),
  );

  if (!marker) {
    return 'missing';
  }

  return marker[1].toLowerCase() === 'x' ? 'approved' : 'pending';
}

export function findEditorialApprovalIssues(
  markdown: string,
): EditorialApprovalIssue[] {
  return editorialApprovalChecks.flatMap(({ id, label }) => {
    const status = findChecklistStatus(markdown, id);

    return status === 'approved' ? [] : [{ id, label, reason: status }];
  });
}

export function assertEditorialApproval(markdown: string): void {
  const issues = findEditorialApprovalIssues(markdown);

  if (issues.length === 0) {
    return;
  }

  const details = issues.map(({ id, label, reason }) => {
    const action = reason === 'missing' ? 'missing from checklist' : 'not confirmed';
    return `- ${id}: ${label} (${action})`;
  });

  throw new Error([
    'Editorial content approval failed:',
    ...details,
    'Every editorial checklist item must be confirmed before release.',
  ].join('\n'));
}
