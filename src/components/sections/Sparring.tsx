'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ShieldOff, UserCheck, Plus, Inbox } from 'lucide-react';
import { PillSwitcher, RoundHeader, Section, VerdictBadge } from '@/components/ui';
import { SPARRING_REQUESTS } from '@/data/features';
import type { SparringRequest } from '@/data/features';
import { cn } from '@/lib/utils';

const FILTERS = [
  { id: 'all', label: 'All Sports' },
  { id: 'Amateur Boxing', label: 'Boxing' },
  { id: 'Kickboxing', label: 'Kickboxing' },
  { id: 'MMA', label: 'MMA' },
  { id: 'Muay Thai', label: 'Muay Thai' },
  { id: 'White-Collar', label: 'White-Collar' },
];

const STATUS: Record<SparringRequest['status'], { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  review: { label: 'Review', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  matched: { label: 'Matched', cls: 'border-zinc-700 bg-zinc-800/50 text-zinc-400' },
};

function RequestCard({ r, index }: { r: SparringRequest; index: number }) {
  const s = STATUS[r.status];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
      className="panel group flex flex-col gap-4 p-5 transition-colors duration-300 hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="metric">{r.code}</span>
          <h3 className="mt-2 font-sans text-base font-extrabold uppercase tracking-tight text-zinc-100">
            {r.bracket}
          </h3>
        </div>
        <span
          className={cn(
            'shrink-0 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]',
            s.cls,
          )}
        >
          {s.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden border border-zinc-800 bg-zinc-900/40">
        {[
          ['Weight', r.weight],
          ['Age Group', r.ageGroup],
          ['Experience', r.experience],
          ['Rounds', r.rounds],
        ].map(([k, v]) => (
          <div key={k} className="bg-zinc-950/70 px-3 py-2.5">
            <dt className="metric">{k}</dt>
            <dd className="mt-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-200">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-[12px] leading-relaxed text-zinc-500">{r.note}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-900 pt-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
            <ShieldOff size={11} className="shrink-0 text-emerald-400" strokeWidth={2.4} />
            <span className="truncate">{r.gym}</span>
          </p>
          <p className="metric mt-1 flex items-center gap-1.5">
            <MapPin size={10} strokeWidth={2.4} />
            {r.distance} radius
          </p>
        </div>
        <span className="metric shrink-0 text-zinc-600">{r.sport}</span>
      </div>
    </motion.article>
  );
}

export default function Sparring() {
  const [filter, setFilter] = useState('all');

  const visible = useMemo(
    () => (filter === 'all' ? SPARRING_REQUESTS : SPARRING_REQUESTS.filter((r) => r.sport === filter)),
    [filter],
  );

  return (
    <Section id="round-03" label="Round 03 — Sparring Finder">
      <RoundHeader
        round="03"
        title="Sparring finder."
        kicker="Post a bracket, not a person. Requests publish as weight range, age group and experience tier — identity, gym name and date of birth stay sealed until both sides opt in."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShieldOff,
            title: 'Identity Withheld',
            body: 'No names, no DOB, no gym on public boards. Junior brackets never expose a person.',
            accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]',
          },
          {
            icon: UserCheck,
            title: 'Guardian Verified',
            body: 'Under-18 brackets stay hidden until guardian consent is confirmed on both sides.',
            accent: 'text-amber-400 border-amber-500/30 bg-amber-500/[0.07]',
          },
          {
            icon: Inbox,
            title: 'Brokered Contact',
            body: 'Messages route through the platform. Contact details release only on mutual accept.',
            accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]',
          },
        ].map(({ icon: Icon, title, body, accent }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="panel flex gap-3.5 p-4"
          >
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center border', accent)}>
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-100">
                {title}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 border-b border-zinc-900 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <PillSwitcher
          ariaLabel="Sparring sport filter"
          size="sm"
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />
        <div className="flex shrink-0 items-center gap-3">
          <span className="metric">
            {visible.length} bracket{visible.length === 1 ? '' : 's'} shown
          </span>
          <button type="button" className="btn-primary clip-notch px-3.5 py-2">
            <Plus size={13} strokeWidth={2.6} />
            Post Bracket
          </button>
        </div>
      </div>

      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((r, i) => (
            <RequestCard key={r.id} r={r} index={i} />
          ))}
        </AnimatePresence>

        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="panel flex flex-col items-center justify-center gap-3 p-12 text-center sm:col-span-2 lg:col-span-3"
          >
            <span className="metric-bright">No open brackets in this discipline</span>
            <p className="text-[13px] text-zinc-500">
              Try another sport, or post your own bracket to be matched.
            </p>
          </motion.div>
        ) : null}
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border border-zinc-900 bg-zinc-950 px-4 py-3.5">
        <VerdictBadge verdict="safe" size="sm" label="GDPR-Aligned" />
        <p className="text-[12px] leading-relaxed text-zinc-500">
          Junior data is never published. Bracket posts are pseudonymous by default and expire after
          30 days unless renewed.
        </p>
      </div>
    </Section>
  );
}
