export interface EarlyAccessDraft {
  name: string;
  email: string;
  club: string;
}

export type EarlyAccessErrors = Partial<Record<keyof EarlyAccessDraft, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEarlyAccess(draft: EarlyAccessDraft): EarlyAccessErrors {
  const errors: EarlyAccessErrors = {};
  if (draft.name.trim().length < 2) errors.name = 'Enter your full name';
  if (!EMAIL.test(draft.email.trim())) errors.email = 'Enter a valid email address';
  return errors;
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}
