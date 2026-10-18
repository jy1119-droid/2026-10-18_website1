'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  Minus,
  QrCode,
  Wallet,
  Store,
  Users,
  CalendarDays,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Counter, RoundHeader, Section } from '@/components/ui';
import { TICKET_TIERS } from '@/data/features';
import { cn } from '@/lib/utils';

const ACCENT = {
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10' },
  amber: { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
  rose: { text: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-500/10' },
} as const;

export default function Events() {
  const [qty, setQty] = useState<Record<string, number>>({ ringsidel: 2 });
  const [cart, setCart] = useState(false);

  const totals = useMemo(() => {
    let subtotal = 0;
    let fees = 0;
    let count = 0;
    TICKET_TIERS.forEach((t) => {
      const n = qty[t.id] ?? 0;
      subtotal += t.price * n;
      fees += t.fee * n;
      count += n;
    });
    return { subtotal, fees, count, total: subtotal + fees };
  }, [qty]);

  const adjust = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(20, (q[id] ?? 0) + delta)) }));

  return (
    <Section id="round-06" label="Round 06 — Events, Store & BoutPass Ticketing" className="bg-zinc-950/40">
      <RoundHeader
        round="06"
        title={'Build the card.\nSell the door.'}
        kicker="Event builder, entry-fee collection, supplier marketplace and BoutPass ticketing in one module. Every ticket traces back to the fighter it funds."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CalendarDays, label: 'Card Builder', value: '9 bouts', sub: 'Auto-sorted by weight' },
          { icon: Wallet, label: 'Entry Fees', value: 'Collected', sub: 'Split to club & fighter' },
          { icon: Store, label: 'Supplier Market', value: '312 vendors', sub: 'Kit, medicals, venue' },
          { icon: Users, label: 'Door Traffic', value: '1,240', sub: 'Scanned via BoutPass' },
        ].map(({ icon: Icon, label, value, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="panel p-5"
          >
            <Icon size={16} className="text-emerald-400" strokeWidth={2.2} />
            <p className="metric mt-4">{label}</p>
            <p className="mt-2 font-sans text-xl font-black leading-none text-zinc-100">{value}</p>
            <p className="mt-2 text-[12px] text-zinc-500">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* BoutPass ticketing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="panel clip-notch p-5 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <span className="metric-bright flex items-center gap-2">
              <Ticket size={13} strokeWidth={2.2} />
              BoutPass Ticketing
            </span>
            <span className="metric">Sat 14 Nov · Manchester</span>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {TICKET_TIERS.map((t) => {
              const a = ACCENT[t.accent];
              const n = qty[t.id] ?? 0;
              return (
                <div
                  key={t.id}
                  className={cn(
                    'border p-4 transition-colors duration-300',
                    n > 0 ? cn(a.border, a.bg) : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-sans text-base font-extrabold uppercase tracking-tight text-zinc-100">
                          {t.name}
                        </h3>
                        {t.badge ? (
                          <span
                            className={cn(
                              'border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]',
                              a.border,
                              a.text,
                            )}
                          >
                            {t.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 metric">
                        £{t.price.toFixed(2)} + £{t.fee.toFixed(2)} fee
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjust(t.id, -1)}
                        disabled={n === 0}
                        aria-label={`Remove one ${t.name} ticket`}
                        className="flex h-8 w-8 items-center justify-center border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white disabled:opacity-30"
                      >
                        <Minus size={12} strokeWidth={2.6} />
                      </button>
                      <span className="w-8 text-center font-mono text-[13px] font-bold tabular-nums text-zinc-100">
                        {n}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjust(t.id, 1)}
                        aria-label={`Add one ${t.name} ticket`}
                        className="flex h-8 w-8 items-center justify-center border border-zinc-800 text-zinc-400 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                      >
                        <Plus size={12} strokeWidth={2.6} />
                      </button>
                    </div>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500"
                      >
                        <Check size={10} className="shrink-0 text-emerald-500" strokeWidth={3} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-5 border-t border-zinc-800 pt-5">
            <dl className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <dt className="metric">Tickets</dt>
                <dd className="font-mono text-[12px] tabular-nums text-zinc-300">{totals.count}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="metric">Face Value</dt>
                <dd className="font-mono text-[12px] tabular-nums text-zinc-300">
                  £{totals.subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="metric">Platform Fee</dt>
                <dd className="font-mono text-[12px] tabular-nums text-zinc-300">
                  £{totals.fees.toFixed(2)}
                </dd>
              </div>
              <div className="mt-2 flex items-end justify-between border-t border-zinc-900 pt-3">
                <dt className="metric-bright">Total Due</dt>
                <dd className="font-sans text-2xl font-black leading-none text-emerald-400">
                  £{totals.total.toFixed(2)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={totals.count === 0}
              onClick={() => setCart(true)}
              className="btn-primary clip-notch mt-5 w-full"
            >
              <QrCode size={14} strokeWidth={2.4} />
              {cart ? 'Passes Issued' : 'Issue BoutPass'}
            </button>

            <AnimatePresence>
              {cart ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 overflow-hidden text-center font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400"
                  role="status"
                >
                  {totals.count} QR passes generated · entry fee routed to the bout fund
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Card generation + marketplace */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="metric-bright">Fight Card · Generated</span>
              <span className="metric">9 bouts</span>
            </div>

            <ul className="mt-5 flex flex-col gap-px overflow-hidden border border-zinc-800">
              {[
                { slot: 'Main Event', a: 'J. Okafor', b: 'D. Mensah', cls: 'Open', tone: 'emerald' },
                { slot: 'Co-Main', a: 'L. Byrne', b: 'K. Adeyemi', cls: 'Open', tone: 'emerald' },
                { slot: 'Undercard 3', a: 'S. Halliwell', b: 'R. Novak', cls: 'Caution', tone: 'amber' },
                { slot: 'Undercard 4', a: 'T. Osei', b: 'M. Reyes', cls: 'Caution', tone: 'amber' },
                { slot: 'Novice Bout 1', a: 'A. Kaur', b: 'P. Lindqvist', cls: 'Novice', tone: 'emerald' },
              ].map((b, i) => (
                <motion.li
                  key={b.slot}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-3 bg-zinc-950/70 px-3.5 py-3"
                >
                  <span className="metric w-20 shrink-0 text-zinc-600">{b.slot}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-200">
                    {b.a} <span className="text-zinc-600">vs</span> {b.b}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]',
                      b.tone === 'emerald'
                        ? 'border-emerald-500/40 text-emerald-300'
                        : 'border-amber-500/40 text-amber-300',
                    )}
                  >
                    {b.cls}
                  </span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-4 text-[12px] leading-relaxed text-zinc-500">
              Slots auto-order by weight and experience. Amber bouts cannot publish until a
              matchmaker signs off.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="metric-bright">Supplier Marketplace</span>
              <span className="metric">312 vendors</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Ring Hire', count: 78 },
                { label: 'Medical Cover', count: 24 },
                { label: 'Gloves & Kit', count: 141 },
                { label: 'Photography', count: 69 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-2 border border-zinc-800 bg-zinc-950/60 px-3 py-3"
                >
                  <span className="metric-bright truncate">{s.label}</span>
                  <span className="metric shrink-0 text-zinc-600">{s.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-zinc-800">
              {[
                { label: 'Fee Split', value: 82, from: 60, suffix: '%' },
                { label: 'Payout Speed', value: 48, from: 72, suffix: 'h' },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-950/70 px-3 py-4">
                  <p className="font-sans text-xl font-black leading-none text-emerald-400">
                    <Counter to={s.value} from={s.from} suffix={s.suffix} />
                  </p>
                  <p className="metric mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            <button type="button" className="btn-ghost clip-notch mt-5 w-full">
              Browse Vendors
              <ArrowRight size={13} strokeWidth={2.4} />
            </button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
