'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Lock, Sliders, RotateCcw } from 'lucide-react';
import { Counter, PillSwitcher, RoundHeader, Section, TrafficLights, VerdictBadge } from '@/components/ui';
import { SPORTS, SPORT_LIST } from '@/lib/sports';
import type { ExperienceLevel, SportId, StopClass } from '@/lib/sports';
import { DEMO_FIGHTER_A, DEMO_FIGHTER_B, evaluateMatch } from '@/lib/matchmaking';
import type { CriterionResult, FighterInput, Verdict } from '@/lib/matchmaking';
import { EXPERIENCE, STOP_CLASSES } from '@/lib/sports';
import { cn } from '@/lib/utils';

interface FighterState {
  name: string;
  age: number;
  weightKg: number;
  experience: ExperienceLevel;
  lastStop: StopClass;
  daysSinceLastBout: number;
  headContactRounds: number;
}

const A0: FighterState = { ...DEMO_FIGHTER_A };
const B0: FighterState = { ...DEMO_FIGHTER_B };

const CRITERION_ICON: Record<Verdict, typeof Check> = {
  safe: Check,
  caution: AlertTriangle,
  blocked: Lock,
};

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
  id,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  id: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="metric">
          {label}
        </label>
        <span className="font-mono text-[12px] font-bold tabular-nums text-zinc-100">
          {step < 1 ? value.toFixed(1) : value}
          <span className="ml-1 text-[10px] text-zinc-500">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 outline-none
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-carbon
          [&::-webkit-slider-thumb]:bg-emerald-400
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-carbon [&::-moz-range-thumb]:bg-emerald-400"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, #27272a ${pct}%, #27272a 100%)`,
        }}
        aria-valuetext={`${value}${unit}`}
      />
    </div>
  );
}

function FighterPanel({
  side,
  state,
  onChange,
}: {
  side: 'A' | 'B';
  state: FighterState;
  onChange: (patch: Partial<FighterState>) => void;
}) {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-100">
          {state.name}
        </span>
        <span className="metric">Corner {side}</span>
      </div>

      <div className="flex flex-col gap-5">
        <Slider
          id={`${side}-age`}
          label="Age"
          unit="yr"
          min={11}
          max={45}
          value={state.age}
          onChange={(v) => onChange({ age: v })}
        />
        <Slider
          id={`${side}-weight`}
          label="Weight"
          unit="kg"
          min={40}
          max={120}
          step={0.1}
          value={state.weightKg}
          onChange={(v) => onChange({ weightKg: v })}
        />
        <Slider
          id={`${side}-rest`}
          label="Days Since Bout"
          unit="d"
          min={0}
          max={400}
          value={state.daysSinceLastBout}
          onChange={(v) => onChange({ daysSinceLastBout: v })}
        />
        <Slider
          id={`${side}-head`}
          label="Head Contact Rounds"
          unit="rds/12mo"
          min={0}
          max={60}
          value={state.headContactRounds}
          onChange={(v) => onChange({ headContactRounds: v })}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${side}-exp`} className="metric mb-2 block">
              Experience
            </label>
            <select
              id={`${side}-exp`}
              value={state.experience}
              onChange={(e) => onChange({ experience: e.target.value as ExperienceLevel })}
              className="field"
            >
              {(Object.keys(EXPERIENCE) as ExperienceLevel[]).map((k) => (
                <option key={k} value={k} className="bg-zinc-900">
                  {EXPERIENCE[k].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${side}-stop`} className="metric mb-2 block">
              Last Result
            </label>
            <select
              id={`${side}-stop`}
              value={state.lastStop}
              onChange={(e) => onChange({ lastStop: e.target.value as StopClass })}
              className="field"
            >
              {STOP_CLASSES.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function CriterionRow({ c, index }: { c: CriterionResult; index: number }) {
  const Icon = CRITERION_ICON[c.verdict];
  const tone =
    c.verdict === 'safe'
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]'
      : c.verdict === 'caution'
        ? 'text-amber-400 border-amber-500/30 bg-amber-500/[0.07]'
        : 'text-rose-400 border-rose-500/30 bg-rose-500/[0.07]';
  const bar =
    c.verdict === 'safe' ? 'bg-emerald-500' : c.verdict === 'caution' ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn('border px-3.5 py-3', tone)}
    >
      <div className="flex items-start gap-3">
        <Icon size={14} strokeWidth={2.6} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-200">
              {c.label}
            </span>
            <span className="font-mono text-[11px] font-bold tabular-nums text-zinc-300">
              {Math.round(c.score)}
            </span>
          </div>
          <p className="mt-1.5 text-[12px] leading-snug text-zinc-400">{c.detail}</p>
          <div className="mt-2 h-0.5 w-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(c.score, 2)}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 + 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={cn('h-full', bar)}
            />
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default function Matchmaking() {
  const [sportId, setSportId] = useState<SportId>('boxing');
  const [a, setA] = useState<FighterState>(A0);
  const [b, setB] = useState<FighterState>(B0);

  const sport = SPORTS[sportId];
  const report = useMemo(
    () => evaluateMatch(a as FighterInput, b as FighterInput, sportId),
    [a, b, sportId],
  );

  const reset = () => {
    setA(A0);
    setB(B0);
  };

  const toneWrap =
    report.verdict === 'safe'
      ? 'border-emerald-500/45 bg-emerald-500/[0.06]'
      : report.verdict === 'caution'
        ? 'border-amber-500/45 bg-amber-500/[0.06]'
        : 'border-rose-500/45 bg-rose-500/[0.06]';

  const scoreColor =
    report.verdict === 'safe'
      ? 'text-emerald-400'
      : report.verdict === 'caution'
        ? 'text-amber-400'
        : 'text-rose-400';

  return (
    <Section id="round-02" label="Round 02 — Matchmaking Engine" className="bg-zinc-950/40">
      <RoundHeader
        round="02"
        title="The matchmaking engine."
        kicker="Move the sliders. The engine re-scores in real time against the selected discipline's ruleset — weight tolerance, medical rest ladder and head-contact ceiling included."
      />

      <div className="mt-12 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillSwitcher
            ariaLabel="Discipline"
            options={SPORT_LIST.map((s) => ({ id: s.id, label: s.label }))}
            value={sportId}
            onChange={setSportId}
          />
          <button type="button" onClick={reset} className="btn-ghost shrink-0 self-start px-3 py-2">
            <RotateCcw size={12} strokeWidth={2.4} />
            Reset
          </button>
        </div>

        <motion.p
          key={sport.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="metric-bright flex flex-wrap items-center gap-x-4 gap-y-2 border border-zinc-900 bg-zinc-950 px-4 py-3"
        >
          <span className="text-emerald-400">{sport.short} RULESET</span>
          <span>Green ≤ {sport.safeWeightGapKg}kg</span>
          <span>Hard ceiling {sport.maxWeightGapKg}kg</span>
          <span>Rounds cap {sport.maxRounds}</span>
          <span className="hidden lg:inline">KO {sport.restDays.ko}d / TKO {sport.restDays.tko}d / PTS {sport.restDays.decision}d</span>
        </motion.p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-5">
          <FighterPanel side="A" state={a} onChange={(p) => setA((s) => ({ ...s, ...p }))} />
          <FighterPanel side="B" state={b} onChange={(p) => setB((s) => ({ ...s, ...p }))} />
        </div>

        {/* Verdict panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className={cn('panel clip-notch overflow-hidden border', toneWrap)}>
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <span className="metric-bright flex items-center gap-2">
                <Sliders size={13} strokeWidth={2.2} />
                Match Report
              </span>
              <TrafficLights active={report.verdict} />
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={report.verdict + report.confidence}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <VerdictBadge
                      verdict={report.verdict}
                      size="lg"
                      label={report.headline.split(' — ')[0]}
                    />
                    <div className="text-right">
                      <p className={cn('font-sans text-3xl font-black leading-none', scoreColor)}>
                        <Counter to={report.confidence} suffix="%" duration={0.9} />
                      </p>
                      <p className="metric mt-1.5">Confidence</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-zinc-300">{report.summary}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-zinc-800 px-5 py-4">
              <p className="metric mb-3">Gate Breakdown · {report.criteria.length} checks</p>
              <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {report.criteria.map((c, i) => (
                    <CriterionRow key={c.id} c={c} index={i} />
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4">
              <p className="text-[12px] leading-relaxed text-zinc-500">
                <span className="metric-bright">Ruleset note — </span>
                {sport.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
