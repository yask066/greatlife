export type DirectionId = 'speech' | 'psychology' | 'bowls';

export type Audience = 'teen' | 'parent' | 'adult';

export type Approval = 'demo' | 'approved';

export interface ContactConfig {
  phoneDisplay: string;
  phoneHref: `tel:${string}`;
  telegramHref: `https://t.me/${string}`;
  approval: Approval;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  audiences: Audience[];
}

export interface Direction {
  id: DirectionId;
  label: string;
  services: Service[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  focus: string[];
  qualification: string;
  photo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  approval: Approval;
  photoConsent: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
  approval: Approval;
  authorConsent: boolean;
}
