'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ *
 * Round header — the structural spine of the page
 * ------------------------------------------------------------------ */

export function RoundHeader({
  round,
  title,
  kicker,
  align = 'left',
  id,
}: {
  round: string;
  title: string;
  kicker?: string;
  align?: 'left' | 'center';
  id?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center')}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span className="h-px w-8 bg-zinc-700" aria-hidden />
        <span className="metric-bright">
          Round {round}
        </span>
        <span className="h-px w-8 bg-zinc-700" aria-hidden />
      </motion.div>

      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="display whitespace-pre-line text-balance text-[2.1rem] sm:text-5xl lg:text-[3.75rem]"
      >
        {title}
      </motion.h2>

      {kicker ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base',
            align === 'center' && 'mx-auto',
          )}
        >
          {kicker}
        </motion.p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Counter — animated numeric readout
 * ------------------------------------------------------------------ */

export function Counter({
  to,
  from = 0,
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className,
}: {
  to: number;
  from?: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Verdict badge — the traffic-light signature component
 * ------------------------------------------------------------------ */

const VERDICT_STYLES = {
  safe: {
    wrap: 'border-emerald-500/45 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
    glow: 'shadow-glow-green',
    label: 'SAFE MATCH',
  },
  caution: {
    wrap: 'border-amber-500/45 bg-amber-500/10 text-amber-300',
    dot: 'bg-amber-400',
    glow: 'shadow-glow-amber',
    label: 'CAUTION',
  },
  blocked: {
    wrap: 'border-rose-500/45 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400',
    glow: 'shadow-glow-red',
    label: 'HARD GATE',
  },
} as const;

export type VerdictKey = keyof typeof VERDICT_STYLES;

export function VerdictBadge({
  verdict,
  size = 'md',
  label,
  className,
}: {
  verdict: VerdictKey;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}) {
  const s = VERDICT_STYLES[verdict];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border font-mono uppercase tracking-fight',
        s.wrap,
        size === 'sm' && 'px-2 py-1 text-[9px]',
        size === 'md' && 'px-3 py-1.5 text-[10px]',
        size === 'lg' && 'px-4 py-2 text-[11px]',
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className={cn('absolute inline-flex h-full w-full rounded-full', s.dot)} />
        {verdict !== 'safe' ? (
          <span
            className={cn('absolute inline-flex h-full w-full rounded-full opacity-70', s.dot)}
            style={{ animation: 'pulseRing 2.4s cubic-bezier(.4,0,.6,1) infinite' }}
          />
        ) : null}
      </span>
      {label ?? s.label}
    </span>
  );
}

export function TrafficLights({ active }: { active: VerdictKey }) {
  const order: VerdictKey[] = ['safe', 'caution', 'blocked'];
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Verdict: ${VERDICT_STYLES[active].label}`}>
      {order.map((v) => {
        const on = v === active;
        return (
          <motion.span
            key={v}
            animate={{
              opacity: on ? 1 : 0.22,
              scale: on ? 1 : 0.82,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              v === 'safe' && 'bg-emerald-400',
              v === 'caution' && 'bg-amber-400',
              v === 'blocked' && 'bg-rose-400',
              on && VERDICT_STYLES[v].glow,
            )}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sport pill switcher
 * ------------------------------------------------------------------ */

export function PillSwitcher<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="no-scrollbar -mx-1 flex w-full gap-2 overflow-x-auto px-1 py-1"
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              'relative shrink-0 whitespace-nowrap border font-mono uppercase tracking-[0.16em] transition-colors duration-200',
              size === 'sm' ? 'px-3 py-2 text-[10px]' : 'px-4 py-2.5 text-[10px] sm:text-[11px]',
              active
                ? 'border-emerald-500/60 text-emerald-300'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300',
            )}
          >
            {active ? (
              <motion.span
                layoutId={`pill-${ariaLabel}`}
                className="absolute inset-0 -z-10 bg-emerald-500/10"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section shell
 * ------------------------------------------------------------------ */

export function Section({
  id,
  children,
  className,
  label,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn('relative border-t border-zinc-900 px-4 py-20 sm:px-6 sm:py-24 lg:py-32', className)}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function NotchFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('panel clip-notch', className)}>{children}</div>;
}
