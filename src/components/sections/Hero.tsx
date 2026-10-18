'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck, Zap, Scale } from 'lucide-react';
import { Counter, VerdictBadge } from '@/components/ui';
import { ROLES } from '@/data/content';
import { LAUNCH_STATS } from '@/data/features';
import { DEMO_FIGHTER_A, DEMO_FIGHTER_B, evaluateMatch } from '@/lib/matchmaking';
import { isValidEmail } from '@/lib/validation';
import { cn } from '@/lib/utils';

const DEMO = evaluateMatch(DEMO_FIGHTER_A, DEMO_FIGHTER_B, 'boxing');
const WEIGHT_CRITERION = DEMO.criteria.find((c) => c.id === 'weight');

const TICKER = [
  'AMATEUR BOXING',
  'KICKBOXING',
  'MMA',
  'MUAY THAI',
  'WHITE-COLLAR',
  'MEDICAL REST ENFORCED',
  '30 / 90 / 180 DAY GATES',
  'JUNIOR DATA PROTECTED',
];

export default function Hero() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('Coach');
  const [state, setState] = useState<'idle' | 'sent'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setState('sent');
  };

  return (
    <section id="round-00" aria-label="Round 00 — Overview" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="metric-bright flex items-center gap-2 border border-zinc-800 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Round 00 — Overview
          </span>
          <VerdictBadge verdict="safe" size="sm" label="Safety-Gated Matchmaking" />
        </motion.div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="display text-balance text-[2.75rem] leading-[0.88] sm:text-6xl lg:text-[5.25rem]"
            >
              Matchmaking
              <br />
              with an{' '}
              <span className="relative inline-block text-emerald-400">
                opinion.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-emerald-500/70"
                  aria-hidden
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              A safety algorithm for combat sports. We score every prospective bout against age,
              weight, experience and governing-body medical rest — then tell you plainly whether it
              should be sanctioned, adjusted, or refused.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {[
                { icon: ShieldCheck, label: 'Hard Safety Gates' },
                { icon: Scale, label: 'Objective Scoring' },
                { icon: Zap, label: 'Matches in Minutes' },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 border border-zinc-800 bg-zinc-950/60 px-3.5 py-3"
                >
                  <Icon size={15} className="shrink-0 text-emerald-400" strokeWidth={2.2} />
                  <span className="metric-bright">{label}</span>
                </li>
              ))}
            </motion.ul>

            {/* Lead capture */}
            <motion.form
              id="hero-capture"
              onSubmit={submit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="panel clip-notch mt-10 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <label htmlFor="hero-email" className="metric-bright">
                  Get early access
                </label>
                <span className="metric">Wave 1 · Coaches &amp; Officials</span>
              </div>

              <AnimatePresence mode="wait">
                {state === 'sent' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 border border-emerald-500/40 bg-emerald-500/10 px-4 py-4 text-emerald-300"
                    role="status"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                      You&apos;re on the card — check your inbox
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="flex-1">
                        <label htmlFor="hero-email" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="hero-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@club.com"
                          className="field"
                        />
                      </div>
                      <button type="submit" className="btn-primary clip-notch shrink-0">
                        Request Access
                        <ArrowRight size={14} strokeWidth={2.4} />
                      </button>
                    </div>

                    <fieldset>
                      <legend className="metric mb-2">I am a…</legend>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((r) => (
                          <button
                            key={r}
                            type="button"
                            aria-pressed={role === r}
                            onClick={() => setRole(r)}
                            className={cn(
                              'border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                              role === r
                                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200',
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>

          {/* Live verdict card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="panel clip-notch panel-hatch overflow-hidden p-5 sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="metric-bright">Live Card · Match Report</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-600">
                REF FR-2291
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  {DEMO_FIGHTER_A.name}
                </p>
                <p className="mt-1 font-sans text-3xl font-black leading-none">
                  {DEMO_FIGHTER_A.weightKg.toFixed(1)}
                </p>
                <p className="metric mt-1">
                  kg · {DEMO_FIGHTER_A.age}yr · {DEMO_FIGHTER_A.experience}
                </p>
              </div>
              <span className="metric-bright shrink-0 border border-zinc-800 px-2 py-1">VS</span>
              <div className="text-right">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  {DEMO_FIGHTER_B.name}
                </p>
                <p className="mt-1 font-sans text-3xl font-black leading-none">
                  {DEMO_FIGHTER_B.weightKg.toFixed(1)}
                </p>
                <p className="metric mt-1">
                  kg · {DEMO_FIGHTER_B.age}yr · {DEMO_FIGHTER_B.experience}
                </p>
              </div>
            </div>

            <div className="mt-6 border border-amber-500/40 bg-amber-500/[0.07] p-4">
              <div className="flex items-center justify-between">
                <VerdictBadge verdict="caution" size="sm" label="Caution · Weight Gap" />
                <span className="font-mono text-lg font-bold text-amber-300">
                  <Counter to={DEMO.confidence} from={DEMO.confidence - 18} suffix="%" duration={1.4} />
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
                {WEIGHT_CRITERION?.detail}. Bout is possible with matchmaker sign-off.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden border border-zinc-800">
              {LAUNCH_STATS.slice(0, 3).map((s) => (
                <div key={s.label} className="bg-zinc-950/80 px-3 py-4">
                  <p className="font-sans text-lg font-black leading-none text-zinc-100 sm:text-xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="metric mt-2 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative overflow-hidden border-y border-zinc-900 bg-zinc-950 py-3">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER.map((t) => (
                <span key={`${dup}-${t}`} className="flex items-center">
                  <span className="metric-bright whitespace-nowrap px-5">{t}</span>
                  <span className="h-1 w-1 rounded-full bg-emerald-500/60" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
