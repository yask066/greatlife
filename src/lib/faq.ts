interface FaqDisclosure {
  trigger: HTMLButtonElement;
  answer: HTMLElement;
  onClick?: () => void;
}

export function initFaq(root: HTMLElement): () => void {
  const disclosures = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]'))
    .map((trigger): FaqDisclosure | null => {
      const answerId = trigger.getAttribute('aria-controls');
      const answer = answerId ? root.querySelector<HTMLElement>(`#${answerId}`) : null;

      return answer ? { trigger, answer } : null;
    })
    .filter((disclosure): disclosure is FaqDisclosure => disclosure !== null);

  root.dataset.enhanced = 'true';

  disclosures.forEach((disclosure) => {
    const { trigger, answer } = disclosure;
    trigger.setAttribute('aria-expanded', 'false');
    answer.hidden = true;

    disclosure.onClick = () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      answer.hidden = isExpanded;
    };
    trigger.addEventListener('click', disclosure.onClick);
  });

  return () => {
    disclosures.forEach(({ trigger, onClick }) => {
      if (onClick) {
        trigger.removeEventListener('click', onClick);
      }
    });
  };
}
