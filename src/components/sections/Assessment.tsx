'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Star, TrendingUp, Lock } from 'lucide-react';
import { RoundHeader, Section } from '@/components/ui';
import RadarChart from '@/components/RadarChart';
import { ATTRIBUTES } from '@/data/features';
import { cn } from '@/lib/utils';

export default function Assessment() {
  const overall = Math.round(ATTRIBUTES.reduce((s, a) => s + a.value, 0) / ATTRIBUTES.length);

  return (
    <Section id="round-04" label="Round 04 — Coach Assessment" className="bg-zinc-950/40">
      <RoundHeader
        round="04"
        title="Coach assessment."
        kicker="Eight attributes, scored 1–100 by a verified coach after each camp block. The spider chart is the fighter's public development record — and the data the engine reads when it grades experience."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="panel clip-notch flex flex-col items-center justify-center p-6 sm:p-8"
        >
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="metric-bright">Attribute Spider</span>
            <span className="metric">8 axes</span>
          </div>
          <RadarChart
            attributes={ATTRIBUTES}
            label="Fighter attribute spider chart across technique, power, speed, fitness, ring craft, defence, aggression and sparring"
          />
          <div className="mt-4 w-full border-t border-zinc-900 pt-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="metric">Composite Index</p>
                <p className="mt-2 font-sans text-4xl font-black leading-none text-emerald-400">
                  {overall}
                  <span className="ml-1 text-base text-zinc-600">/100</span>
                </p>
              </div>
              <p className="metric-bright max-w-[46%] text-right leading-relaxed">
                Verified coach signature required · Re-scored every camp block
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <div className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="metric-bright flex items-center gap-2">
                <ClipboardCheck size={13} strokeWidth={2.2} />
                Scorecard Breakdown
              </span>
              <span className="metric">Camp Block · Q3</span>
            </div>

            <ul className="mt-5 flex flex-col gap-3.5">
              {ATTRIBUTES.map((a, i) => (
                <li key={a.key}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-300">
                      {a.label}
                    </span>
                    <span className="font-mono text-[11px] font-bold tabular-nums text-zinc-400">
                      {a.value}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.value}%` }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        'h-full',
                        a.value >= 80
                          ? 'bg-emerald-500'
                          : a.value >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500',
                      )}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Star, label: 'Verified Only', body: 'Only licensed coaches can submit a score.' },
              { icon: TrendingUp, label: 'Tracked Growth', body: 'Every block is versioned and comparable.' },
              { icon: Lock, label: 'Fighter Controlled', body: 'Private by default; publish when ready.' },
            ].map(({ icon: Icon, label, body }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="panel p-4"
              >
                <Icon size={15} className="text-emerald-400" strokeWidth={2.2} />
                <h3 className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-100">
                  {label}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
