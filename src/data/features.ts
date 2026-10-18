export interface SparringRequest {
  id: string;
  code: string;
  sport: string;
  bracket: string;
  weight: string;
  ageGroup: string;
  experience: string;
  rounds: string;
  gym: string;
  distance: string;
  status: 'open' | 'matched' | 'review';
  note: string;
}

export const SPARRING_REQUESTS: SparringRequest[] = [
  {
    id: 'r1',
    code: 'FR-2291',
    sport: 'Amateur Boxing',
    bracket: 'Senior Male',
    weight: '69–71kg',
    ageGroup: 'U25',
    experience: 'Open Class',
    rounds: '6 x 3min',
    gym: 'Verified Club · Manchester',
    distance: '18mi',
    status: 'open',
    note: 'Seeks southpaw work. Headguard mandatory.',
  },
  {
    id: 'r2',
    code: 'FR-2287',
    sport: 'Muay Thai',
    bracket: 'Senior Female',
    weight: '54–57kg',
    ageGroup: 'U23',
    experience: 'Elite',
    rounds: '5 x 3min',
    gym: 'Verified Club · Leeds',
    distance: '31mi',
    status: 'review',
    note: 'Clinch-heavy session. No elbows requested.',
  },
  {
    id: 'r3',
    code: 'FR-2280',
    sport: 'MMA',
    bracket: 'Junior (Guardian)',
    weight: '61–66kg',
    ageGroup: 'U18',
    experience: 'Novice',
    rounds: '3 x 3min',
    gym: 'Verified Club · Birmingham',
    distance: '9mi',
    status: 'open',
    note: 'Guardian consent verified. Identity withheld.',
  },
  {
    id: 'r4',
    code: 'FR-2274',
    sport: 'Kickboxing',
    bracket: 'Senior Male',
    weight: '75–79kg',
    ageGroup: 'Over 35',
    experience: 'Open Class',
    rounds: '4 x 2min',
    gym: 'Verified Club · Glasgow',
    distance: '42mi',
    status: 'matched',
    note: 'Masters bracket. Reduced round length.',
  },
  {
    id: 'r5',
    code: 'FR-2269',
    sport: 'White-Collar',
    bracket: 'Senior Mixed',
    weight: '80–84kg',
    ageGroup: 'U30',
    experience: 'Novice',
    rounds: '3 x 2min',
    gym: 'Verified Club · London',
    distance: '4mi',
    status: 'open',
    note: 'First bout. Charity card, 12 weeks out.',
  },
];

export interface Attribute {
  key: string;
  label: string;
  value: number;
}

export const ATTRIBUTES: Attribute[] = [
  { key: 'technique', label: 'Technique', value: 82 },
  { key: 'power', label: 'Power', value: 71 },
  { key: 'speed', label: 'Speed', value: 88 },
  { key: 'fitness', label: 'Fitness', value: 76 },
  { key: 'ringcraft', label: 'Ring Craft', value: 64 },
  { key: 'defence', label: 'Defence', value: 69 },
  { key: 'aggression', label: 'Aggression', value: 79 },
  { key: 'sparring', label: 'Sparring', value: 85 },
];

export interface ProfileStat {
  label: string;
  value: string;
  sub: string;
}

export const PROFILE_STATS: ProfileStat[] = [
  { label: 'Record', value: '14–2–1', sub: '8 KO' },
  { label: 'Weight Class', value: '69kg', sub: 'Light Middle' },
  { label: 'Stance', value: 'Southpaw', sub: 'Orthodox switch' },
  { label: 'Licence', value: 'Open', sub: 'Valid to 11/27' },
];

export const PROFILE_FORM: { result: 'W' | 'L' | 'D'; opponent: string; method: string; date: string }[] = [
  { result: 'W', opponent: 'D. Mensah', method: 'UD', date: '2026-07-11' },
  { result: 'W', opponent: 'K. Bright', method: 'TKO R2', date: '2026-04-19' },
  { result: 'L', opponent: 'A. Novak', method: 'SD', date: '2026-01-30' },
  { result: 'W', opponent: 'R. Ibeh', method: 'KO R3', date: '2025-11-08' },
  { result: 'D', opponent: 'T. Lindqvist', method: 'Draw', date: '2025-09-02' },
];

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  fee: number;
  perks: string[];
  accent: 'emerald' | 'amber' | 'rose';
  badge?: string;
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'floor',
    name: 'Floor Standing',
    price: 35,
    fee: 4.5,
    perks: ['Standing floor access', 'Digital BoutPass QR', 'Event programme'],
    accent: 'amber',
  },
  {
    id: 'ringsidel',
    name: 'Ringside',
    price: 90,
    fee: 9,
    perks: ['Seated ringside block A–C', 'Priority entry lane', 'Fighter meet window'],
    accent: 'emerald',
    badge: 'Most Claimed',
  },
  {
    id: 'corner',
    name: 'Corner Table',
    price: 180,
    fee: 16,
    perks: ['Table of 4', 'Table service', 'Named on the card programme'],
    accent: 'rose',
  },
];

export interface FaqItem {
  q: string;
  a: string;
  tag: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does the matchmaking algorithm actually score a bout?',
    a: 'Every pairing runs through six weighted gates: age band, weight gap, experience spread, governing-body medical rest, accumulated head-contact load and licence classification. Each gate returns its own verdict and a 0–100 contribution. The lowest-scoring gate drives the overall verdict, so a single hard failure can never be averaged away by strong scores elsewhere.',
    tag: 'Algorithm',
  },
  {
    q: 'What is a hard gate versus a caution?',
    a: 'A hard gate is a non-negotiable rule — an outstanding suspension, a professional paired with an amateur, or a weight gap beyond the discipline ceiling. Those return a red Suspension Lock and the platform will not generate a bout contract. Cautions are amber: the bout is possible, but a matchmaker or medical officer has to sign off before it publishes to the card.',
    tag: 'Safety',
  },
  {
    q: 'Which governing-body rest periods are enforced?',
    a: 'We ship with the standard stoppage ladder — 30 days after a points loss, 90 days after a TKO and 180 days after a KO — and each discipline can tighten it. MMA applies 120 days for a TKO and 45 for a points loss, and white-collar applies a 180-day window across every stoppage class. Your sanctioning body can override the ladder per federation.',
    tag: 'Compliance',
  },
  {
    q: 'How do you protect junior and minor fighter data?',
    a: 'Junior brackets never publish a name, date of birth or gym. Sparring requests post as an anonymous bracket showing weight range, age group and experience tier only. Guardian consent is verified before the bracket becomes visible, and contact is brokered through the platform until both guardians approve the exchange.',
    tag: 'Privacy',
  },
  {
    q: 'What does it cost?',
    a: 'Fighters and coaches are free forever, including sparring finder and assessment history. Clubs and promoters pay a flat platform fee per published card, plus a transaction fee on BoutPass ticketing and entry-fee collection. There is no charge per bout and no charge to appear on a card.',
    tag: 'Pricing',
  },
  {
    q: 'Do you replace the matchmaker?',
    a: 'No. The engine produces an opinion — a ranked list of sanctionable pairings with the reasoning attached. A licensed matchmaker still owns the final card. What changes is that they start from an objective shortlist instead of a WhatsApp scroll, and every decision is logged for the sanctioning body.',
    tag: 'Algorithm',
  },
  {
    q: 'Can we migrate existing paper records and spreadsheets?',
    a: 'Yes. Import a CSV of bout history, medicals and licence numbers and we map it to the fighter profile format. Records are flagged as imported until a club official countersigns them, and imported bouts carry no verification badge until they are confirmed.',
    tag: 'Compliance',
  },
  {
    q: 'When does the platform launch and what happens to early access sign-ups?',
    a: 'Public launch is autumn 2026. Early access sign-ups are invited in waves by role, starting with coaches and officials so the first cards are fully sanctioned. Your sport and role answers determine which wave you land in, and pricing is locked at the early-access rate for the first twelve months.',
    tag: 'Launch',
  },
];

export const LAUNCH_STATS = [
  { label: 'Clubs Onboarded', value: 428, suffix: '+' },
  { label: 'Bouts Scored', value: 12940, suffix: '' },
  { label: 'Unsafe Pairings Blocked', value: 1136, suffix: '' },
  { label: 'Avg. Time To Match', value: 4, suffix: 'min' },
];
