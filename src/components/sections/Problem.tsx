'use client';

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, EyeOff, CalendarX, TrendingDown, ArrowRight } from 'lucide-react';
import { RoundHeader, Section } from '@/components/ui';
import { PAIN_POINTS } from '@/data/content';
import { cn, scrollToId } from '@/lib/utils';

const ICONS: Record<string, typeof Clock> = {
  hours: Clock,
  mismatch: AlertTriangle,
  invisible: EyeOff,
  medicals: CalendarX,
  tickets: TrendingDown,
};

const ACCENT = {
  emerald: {
    border: 'hover:border-emerald-500/50',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    line: 'bg-emerald-500/60',
  },
  amber: {
    border: 'hover:border-amber-500/50',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    line: 'bg-amber-500/60',
  },
  rose: {
    border: 'hover:border-rose-500/50',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    line: 'bg-rose-500/60',
  },
} as const;

export default function Problem() {
  return (
    <Section id="round-01" label="Round 01 — The Problem">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <RoundHeader
          round="01"
          title={'The problem\nnobody logs.'}
          kicker="Combat sports runs on goodwill and group chats. Five failure points cost the sport money, time and — occasionally — a fighter's health."
        />
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          type="button"
          onClick={() => scrollToId('round-02')}
          className="btn-ghost clip-notch shrink-0 self-start lg:self-end"
        >
          See the fix
          <ArrowRight size={13} strokeWidth={2.4} />
        </motion.button>
      </div>

      <div className="mt-14 grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PAIN_POINTS.map((p, i) => {
          const Icon = ICONS[p.id] ?? Clock;
          const a = ACCENT[p.accent];
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'panel group relative flex flex-col justify-between overflow-hidden p-5 transition-colors duration-300 sm:p-6',
                a.border,
                p.span,
              )}
            >
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100',
                  a.line,
                )}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center border border-zinc-800',
                    a.bg,
                    a.text,
                  )}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </span>
                <span className="metric shrink-0">{p.tag}</span>
              </div>

              <div className="mt-8">
                <p className={cn('font-sans text-4xl font-black leading-none tracking-tight sm:text-5xl', a.text)}>
                  {p.metric}
                </p>
                <p className="metric mt-2">{p.metricLabel}</p>

                <h3 className="mt-5 font-sans text-lg font-extrabold uppercase tracking-tight text-zinc-100 sm:text-xl">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-zinc-400">{p.body}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
