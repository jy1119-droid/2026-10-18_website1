'use client';

import { motion } from 'framer-motion';
import { Play, MapPin, BadgeCheck, Camera, Video, Share2 } from 'lucide-react';
import { RoundHeader, Section, VerdictBadge } from '@/components/ui';
import { PROFILE_FORM, PROFILE_STATS } from '@/data/features';
import { cn } from '@/lib/utils';

const RESULT_CLS: Record<'W' | 'L' | 'D', string> = {
  W: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  L: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  D: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
};

export default function Profile() {
  return (
    <Section id="round-05" label="Round 05 — Fighter Profile">
      <RoundHeader
        round="05"
        title={'A fighter profile\nthat travels.'}
        kicker="One verified record. Bout history, media reels, club affiliation and licence status — portable across clubs, shows and sanctioning bodies."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Profile card */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="panel clip-notch overflow-hidden"
        >
          <div className="relative h-28 bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950 panel-hatch sm:h-32">
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                type="button"
                aria-label="Share profile"
                className="flex h-8 w-8 items-center justify-center border border-zinc-700/70 bg-carbon/70 text-zinc-400 transition-colors hover:text-white"
              >
                <Share2 size={13} strokeWidth={2.2} />
              </button>
            </div>
            <span className="absolute bottom-4 left-5 metric-bright">Licence FR-2291 · Open Class</span>
          </div>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="-mt-9 flex items-end gap-4">
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center border-2 border-carbon bg-zinc-800 font-sans text-2xl font-black text-zinc-400">
                JO
              </div>
              <div className="pb-1">
                <h3 className="flex items-center gap-2 font-sans text-xl font-black uppercase tracking-tight text-zinc-50">
                  J. Okafor
                  <BadgeCheck size={16} className="text-emerald-400" strokeWidth={2.4} />
                </h3>
                <p className="metric mt-1.5 flex items-center gap-1.5">
                  <MapPin size={10} strokeWidth={2.4} />
                  Light Middleweight · Manchester
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-zinc-800 bg-zinc-900/40 sm:grid-cols-4">
              {PROFILE_STATS.map((s) => (
                <div key={s.label} className="bg-zinc-950/70 px-3 py-3.5">
                  <dt className="metric">{s.label}</dt>
                  <dd className="mt-2 font-sans text-lg font-black leading-none text-zinc-100">
                    {s.value}
                  </dd>
                  <dd className="metric mt-1.5 text-zinc-600">{s.sub}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <p className="metric mb-3">Recent Form</p>
              <ul className="flex flex-col gap-px overflow-hidden border border-zinc-800">
                {PROFILE_FORM.map((b, i) => (
                  <motion.li
                    key={`${b.opponent}-${b.date}`}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-center gap-3 bg-zinc-950/70 px-3 py-3 transition-colors hover:bg-zinc-900/60"
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[10px] font-bold',
                        RESULT_CLS[b.result],
                      )}
                    >
                      {b.result}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-300">
                      {b.opponent}
                    </span>
                    <span className="metric hidden shrink-0 sm:block">{b.method}</span>
                    <span className="metric shrink-0 text-zinc-600">{b.date}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.article>

        {/* Media reel + affiliations */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="metric-bright">Media Reel</span>
              <span className="metric">4 clips</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: 'R2 TKO · 2026', dur: '0:48', tone: 'from-emerald-500/25' },
                { label: 'Sparring Block', dur: '1:32', tone: 'from-amber-500/25' },
                { label: 'Pad Work', dur: '0:37', tone: 'from-zinc-600/30' },
                { label: 'Ring Walk', dur: '0:21', tone: 'from-rose-500/20' },
              ].map((m, i) => (
                <motion.button
                  key={m.label}
                  type="button"
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className={cn(
                    'group relative flex aspect-video flex-col justify-end overflow-hidden border border-zinc-800 bg-gradient-to-br to-zinc-950 p-3 text-left transition-colors hover:border-zinc-700',
                    m.tone,
                  )}
                  aria-label={`Play clip: ${m.label}`}
                >
                  <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center border border-zinc-700 bg-carbon/70 text-zinc-300 transition-colors group-hover:border-emerald-500/60 group-hover:text-emerald-300">
                    <Play size={11} strokeWidth={2.6} fill="currentColor" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-200">
                    {m.label}
                  </span>
                  <span className="metric mt-1">{m.dur}</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: Video, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 border border-zinc-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400"
                >
                  <Icon size={12} strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 sm:p-6"
          >
            <span className="metric-bright">Club Affiliation &amp; Compliance</span>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                { label: 'Registered Club', value: 'Northside ABC', ok: true },
                { label: 'Medical On File', value: 'Valid to 04/2027', ok: true },
                { label: 'Suspension Status', value: 'Clear', ok: true },
                { label: 'Insurance Cover', value: 'Federation scheme', ok: true },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-3 last:border-0 last:pb-0"
                >
                  <span className="metric">{row.label}</span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-200">
                    {row.value}
                    <BadgeCheck size={13} className="text-emerald-400" strokeWidth={2.6} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <VerdictBadge verdict="safe" size="sm" label="Cleared to Compete" />
              <VerdictBadge verdict="caution" size="sm" label="Weight Check Due" />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
