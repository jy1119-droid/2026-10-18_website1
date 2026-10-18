'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { RoundHeader, Section } from '@/components/ui';
import { SPORT_LIST } from '@/lib/sports';
import { ROLES } from '@/data/content';
import { validateEarlyAccess } from '@/lib/validation';
import type { EarlyAccessErrors } from '@/lib/validation';
import { cn } from '@/lib/utils';

const ROLE_COPY: Record<string, { headline: string; body: string; bullets: string[] }> = {
  Coach: {
    headline: 'Stop chasing bouts in group chats.',
    body: 'Publish your fighters, get an objective shortlist back, and log every match decision for your sanctioning body.',
    bullets: ['Free forever for coaches', 'Sparring finder access', 'Assessment records for every fighter'],
  },
  Fighter: {
    headline: 'Be findable. Be fairly matched.',
    body: 'A portable verified record, a public profile you control, and a matchmaker that refuses unsafe pairings.',
    bullets: ['Portable bout record', 'Media reel + profile', 'Suspension status tracked for you'],
  },
  Promoter: {
    headline: 'Build cards that survive scrutiny.',
    body: 'Generate a sanctionable card in minutes, collect entry fees and sell the door with BoutPass.',
    bullets: ['Card builder with safety verdicts', 'Entry fee + ticket collection', 'Supplier marketplace'],
  },
  Official: {
    headline: 'Every decision, logged.',
    body: 'Enforce the rest ladder automatically and get a full audit trail behind every sanctioned bout.',
    bullets: ['30/90/180 day gate enforcement', 'Audit trail per bout', 'Medical submission tracking'],
  },
  Supplier: {
    headline: 'Get in front of the card.',
    body: 'List ring hire, medicals, kit and media to promoters building cards on the platform.',
    bullets: ['Verified vendor listings', 'Direct promoter requests', '48-hour payouts'],
  },
};

export default function WhoItsFor() {
  const [tab, setTab] = useState<'role' | 'sport'>('role');
  const [role, setRole] = useState('Coach');
  const [sports, setSports] = useState<string[]>(['boxing']);
  const [form, setForm] = useState({ name: '', email: '', club: '' });
  const [errors, setErrors] = useState<EarlyAccessErrors>({});
  const [sent, setSent] = useState(false);

  const copy = ROLE_COPY[role] ?? ROLE_COPY.Coach;

  const toggleSport = (id: string) =>
    setSports((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateEarlyAccess(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  };

  return (
    <Section id="round-07" label="Round 07 — Who It's For">
      <RoundHeader
        round="07"
        title="Who it's for."
        kicker="Five audiences, one platform. Pick your seat and your sport — early-access waves are sequenced by role so the first cards are fully sanctioned."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: tabbed switcher */}
        <div className="flex flex-col gap-5">
          <div
            role="tablist"
            aria-label="Audience switcher"
            className="grid grid-cols-2 gap-px overflow-hidden border border-zinc-800"
          >
            {(
              [
                { id: 'role', label: 'I am a…' },
                { id: 'sport', label: 'My sport is…' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`who-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`who-panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors',
                  tab === t.id ? 'text-emerald-300' : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                {tab === t.id ? (
                  <motion.span
                    layoutId="who-tab"
                    className="absolute inset-0 -z-10 bg-emerald-500/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'role' ? (
              <motion.div
                key="role"
                role="tabpanel"
                id="who-panel-role"
                aria-labelledby="who-tab-role"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-2"
              >
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={role === r}
                    onClick={() => setRole(r)}
                    className={cn(
                      'border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                      role === r
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                        : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="sport"
                role="tabpanel"
                id="who-panel-sport"
                aria-labelledby="who-tab-sport"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-2"
              >
                {SPORT_LIST.map((s) => {
                  const on = sports.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleSport(s.id)}
                      className={cn(
                        'flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                        on
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-3.5 w-3.5 items-center justify-center border',
                          on ? 'border-emerald-400 bg-emerald-400/20' : 'border-zinc-700',
                        )}
                      >
                        {on ? <Check size={9} strokeWidth={3.5} /> : null}
                      </span>
                      {s.label}
                    </button>
                  );
                })}
                <p className="metric w-full pt-1">Multi-select · {sports.length} selected</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={role}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="panel clip-notch p-5 sm:p-6"
          >
            <span className="metric-bright">Selected · {role}</span>
            <h3 className="mt-3 font-sans text-xl font-black uppercase leading-tight tracking-tight text-zinc-50 sm:text-2xl">
              {copy.headline}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">{copy.body}</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {copy.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={3} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right: early access form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="panel clip-notch panel-hatch p-5 sm:p-7"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <span className="metric-bright flex items-center gap-2">
              <Sparkles size={13} strokeWidth={2.2} className="text-emerald-400" />
              Early Access
            </span>
            <span className="metric">Wave 1 · Autumn 2026</span>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4 py-12 text-center"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 22 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                >
                  <Check size={26} strokeWidth={3} />
                </motion.span>
                <h3 className="font-sans text-xl font-black uppercase tracking-tight text-zinc-50">
                  You&apos;re on the card
                </h3>
                <p className="max-w-sm text-[13px] leading-relaxed text-zinc-400">
                  Thanks {form.name.split(' ')[0] || 'coach'} — we&apos;ve logged you as a{' '}
                  <span className="text-emerald-300">{role}</span> for{' '}
                  <span className="text-emerald-300">{sports.length}</span>{' '}
                  {sports.length === 1 ? 'sport' : 'sports'}. Watch your inbox for your wave invite.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: '', email: '', club: '' });
                  }}
                  className="btn-ghost clip-notch mt-2"
                >
                  Register another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={submit}
                noValidate
                className="mt-5 flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="ea-name" className="metric mb-2 block">
                    Full Name
                  </label>
                  <input
                    id="ea-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'ea-name-error' : undefined}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Alex Morgan"
                    className={cn('field', errors.name && 'border-rose-500/70')}
                  />
                  {errors.name ? (
                    <p id="ea-name-error" role="alert" className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-rose-400">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="ea-email" className="metric mb-2 block">
                    Email Address
                  </label>
                  <input
                    id="ea-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'ea-email-error' : undefined}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@club.com"
                    className={cn('field', errors.email && 'border-rose-500/70')}
                  />
                  {errors.email ? (
                    <p id="ea-email-error" role="alert" className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-rose-400">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="ea-club" className="metric mb-2 block">
                    Club / Organisation <span className="text-zinc-700">(optional)</span>
                  </label>
                  <input
                    id="ea-club"
                    name="club"
                    type="text"
                    autoComplete="organization"
                    value={form.club}
                    onChange={(e) => setForm((f) => ({ ...f, club: e.target.value }))}
                    placeholder="Northside ABC"
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="ea-role" className="metric mb-2 block">
                    Role
                  </label>
                  <select
                    id="ea-role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="field"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-zinc-900">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="metric mb-2 block">Sports</span>
                  <div className="flex flex-wrap gap-2">
                    {SPORT_LIST.map((s) => {
                      const on = sports.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleSport(s.id)}
                          className={cn(
                            'border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors',
                            on
                              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
                          )}
                        >
                          {s.short}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="btn-primary clip-notch mt-2 w-full">
                  Claim Early Access
                  <ArrowRight size={14} strokeWidth={2.4} />
                </button>

                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-600">
                  <ShieldCheck size={11} strokeWidth={2.4} />
                  No spam. Pricing locked at early-access rate for 12 months.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {!sent ? (
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-900 pt-5">
              <Mail size={14} className="shrink-0 text-zinc-600" strokeWidth={2.2} />
              <p className="text-[12px] leading-relaxed text-zinc-500">
                Already on a wave list? We match your email to your existing invite.
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </Section>
  );
}
