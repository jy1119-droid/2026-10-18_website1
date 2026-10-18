'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import { RoundHeader, Section } from '@/components/ui';
import { FAQ_ITEMS } from '@/data/features';
import { cn } from '@/lib/utils';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" label="Frequently asked questions" className="bg-zinc-950/40">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RoundHeader
            round="08"
            title={'Questions,\nanswered.'}
            kicker="How the scoring works, what the safety gates refuse to allow, and what it costs."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {['Algorithm', 'Safety', 'Compliance', 'Privacy', 'Pricing', 'Launch'].map((t) => (
              <span
                key={t}
                className="border border-zinc-800 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'border transition-colors duration-300',
                  isOpen ? 'border-zinc-700 bg-zinc-950' : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700',
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <HelpCircle
                      size={15}
                      className={cn('shrink-0 transition-colors', isOpen ? 'text-emerald-400' : 'text-zinc-600')}
                      strokeWidth={2.2}
                    />
                    <span
                      className={cn(
                        'flex-1 font-sans text-[14px] font-bold leading-snug transition-colors sm:text-[15px]',
                        isOpen ? 'text-zinc-50' : 'text-zinc-300',
                      )}
                    >
                      {item.q}
                    </span>
                    <span className="hidden shrink-0 border border-zinc-800 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-600 sm:block">
                      {item.tag}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center border transition-colors',
                        isOpen
                          ? 'border-emerald-500/50 text-emerald-400'
                          : 'border-zinc-800 text-zinc-500',
                      )}
                      aria-hidden
                    >
                      <Plus size={13} strokeWidth={2.6} />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-zinc-900 px-4 pb-5 pt-4 text-[13px] leading-relaxed text-zinc-400 sm:px-5 sm:pl-[3.1rem]">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
