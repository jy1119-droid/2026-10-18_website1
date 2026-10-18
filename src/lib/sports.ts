export type Verdict = 'safe' | 'caution' | 'blocked';

export type SportId = 'boxing' | 'kickboxing' | 'mma' | 'muaythai' | 'whitecollar';

export interface Sport {
  id: SportId;
  label: string;
  short: string;
  /** Maximum tolerated weight gap, in kg, for a clean green match. */
  safeWeightGapKg: number;
  /** Maximum tolerated weight gap before the bout hard-fails. */
  maxWeightGapKg: number;
  /** Minimum recovery days enforced after a stoppage loss, by stoppage class. */
  restDays: { ko: number; tko: number; decision: number };
  /** Bout-length ceiling for the discipline, in rounds. */
  maxRounds: number;
  /** Rounds that trigger head-contact accumulation review. */
  headContactReviewRounds: number;
  notes: string;
}

export const SPORTS: Record<SportId, Sport> = {
  boxing: {
    id: 'boxing',
    label: 'Amateur Boxing',
    short: 'BOX',
    safeWeightGapKg: 1.5,
    maxWeightGapKg: 3,
    restDays: { ko: 180, tko: 90, decision: 30 },
    maxRounds: 3,
    headContactReviewRounds: 3,
    notes: 'Bout lengths capped at 3 x 3min. Headguard mandatory for novice class.',
  },
  kickboxing: {
    id: 'kickboxing',
    label: 'Kickboxing',
    short: 'KB',
    safeWeightGapKg: 2,
    maxWeightGapKg: 4,
    restDays: { ko: 180, tko: 90, decision: 30 },
    maxRounds: 5,
    headContactReviewRounds: 5,
    notes: 'K-1 ruleset flag applied automatically when both fighters are graded.',
  },
  mma: {
    id: 'mma',
    label: 'MMA',
    short: 'MMA',
    safeWeightGapKg: 2,
    maxWeightGapKg: 4.5,
    restDays: { ko: 180, tko: 120, decision: 45 },
    maxRounds: 3,
    headContactReviewRounds: 3,
    notes: 'Ground-contact and submission history weighted into the experience index.',
  },
  muaythai: {
    id: 'muaythai',
    label: 'Muay Thai',
    short: 'MT',
    safeWeightGapKg: 2,
    maxWeightGapKg: 4,
    restDays: { ko: 180, tko: 90, decision: 30 },
    maxRounds: 5,
    headContactReviewRounds: 5,
    notes: 'Clinch and elbow exposure raises the assessment weighting on defence.',
  },
  whitecollar: {
    id: 'whitecollar',
    label: 'White-Collar',
    short: 'WC',
    safeWeightGapKg: 3,
    maxWeightGapKg: 6,
    restDays: { ko: 180, tko: 180, decision: 90 },
    maxRounds: 3,
    headContactReviewRounds: 3,
    notes: 'Novice-only brackets. Zero tolerance on prior professional record.',
  },
};

export const SPORT_LIST: Sport[] = Object.values(SPORTS);

export type ExperienceLevel = 'novice' | 'open' | 'elite' | 'pro';

export const EXPERIENCE: Record<ExperienceLevel, { label: string; bouts: string; index: number }> = {
  novice: { label: 'Novice', bouts: '0–4 bouts', index: 1 },
  open: { label: 'Open Class', bouts: '5–14 bouts', index: 2 },
  elite: { label: 'Elite', bouts: '15–29 bouts', index: 3 },
  pro: { label: 'Professional', bouts: '30+ bouts', index: 4 },
};

export type StopClass = 'none' | 'decision' | 'tko' | 'ko';

export const STOP_CLASSES: { id: StopClass; label: string; detail: string }[] = [
  { id: 'none', label: 'No Stoppage', detail: 'Clear medicals on file' },
  { id: 'decision', label: 'Points Loss', detail: '30-day rest window' },
  { id: 'tko', label: 'TKO Loss', detail: '90–120 day rest window' },
  { id: 'ko', label: 'KO Loss', detail: '180-day suspension lock' },
];
