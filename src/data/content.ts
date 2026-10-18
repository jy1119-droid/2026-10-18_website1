export interface NavItem {
  id: string;
  label: string;
  round: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'round-00', label: 'Overview', round: '00' },
  { id: 'round-01', label: 'The Problem', round: '01' },
  { id: 'round-02', label: 'Matchmaking', round: '02' },
  { id: 'round-03', label: 'Sparring', round: '03' },
  { id: 'round-04', label: 'Assessment', round: '04' },
  { id: 'round-05', label: 'Profile', round: '05' },
  { id: 'round-06', label: 'Events & Ticketing', round: '06' },
  { id: 'round-07', label: "Who It's For", round: '07' },
  { id: 'faq', label: 'FAQ', round: '—' },
];

export const ROLES = ['Coach', 'Fighter', 'Promoter', 'Official', 'Supplier'] as const;
export type Role = (typeof ROLES)[number];

export interface PainPoint {
  id: string;
  tag: string;
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  accent: 'emerald' | 'amber' | 'rose';
  span: string;
}

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 'hours',
    tag: 'Admin Debt',
    metric: '6.5h',
    metricLabel: 'per bout, per coach',
    title: 'Hours lost',
    body: 'Coaches chase bouts across WhatsApp groups, screenshots and three governing-body portals. Every match is a manual negotiation with no audit trail.',
    accent: 'amber',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    id: 'mismatch',
    tag: 'Safety',
    metric: '1 in 5',
    metricLabel: 'bouts flagged unsafe',
    title: 'Mismatches happen',
    body: 'Without objective data, pairing leans on who shouted loudest. Weight gaps and rest periods get missed.',
    accent: 'rose',
    span: 'lg:col-span-2',
  },
  {
    id: 'invisible',
    tag: 'Discovery',
    metric: '0',
    metricLabel: 'public bout records',
    title: 'Fighters are invisible',
    body: 'Paper records sit in a drawer. Talent never gets seen outside its own gym.',
    accent: 'emerald',
    span: 'lg:col-span-2',
  },
  {
    id: 'medicals',
    tag: 'Compliance',
    metric: '30/90/180',
    metricLabel: 'day suspension rules',
    title: 'Rest periods get missed',
    body: 'Stoppage suspensions are tracked by memory. A 180-day KO lock is one spreadsheet row away from being ignored.',
    accent: 'amber',
    span: 'lg:col-span-1',
  },
  {
    id: 'tickets',
    tag: 'Revenue',
    metric: '£0',
    metricLabel: 'traced to the fighter',
    title: 'Money leaks out',
    body: 'Ticket revenue, entry fees and supplier spend move through personal accounts with no reconciliation.',
    accent: 'emerald',
    span: 'lg:col-span-1',
  },
];
