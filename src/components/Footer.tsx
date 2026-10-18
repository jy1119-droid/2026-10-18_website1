'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp, Swords, ExternalLink } from 'lucide-react';
import { NAV_ITEMS } from '@/data/content';
import { scrollToId } from '@/lib/utils';

export default function Footer() {
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  const dashOffset = useTransform(progress, [0, 1], [100, 0]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative border-t border-zinc-900 bg-carbon">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                <Swords size={15} strokeWidth={2.4} />
              </span>
              <span className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-100">
                Fighter<span className="text-emerald-400">Ready</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-zinc-500">
              Safety-first matchmaking, sparring and event infrastructure for combat sports. Built
              with coaches, officials and sanctioning bodies.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {['GitHub', 'LinkedIn'].map((label) => (
                <a
                  key={label}
                  href="#round-00"
                  className="inline-flex items-center gap-2 border border-zinc-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                >
                  {label}
                  <ExternalLink size={11} strokeWidth={2.2} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer — rounds">
            <p className="metric-bright">The Rounds</p>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(n.id)}
                    className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    <span className="text-[9px] text-zinc-700 group-hover:text-emerald-500">
                      {n.round}
                    </span>
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="metric-bright">Legal</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {[
                { label: 'Privacy Policy', href: '#faq' },
                { label: 'Terms of Service', href: '#faq' },
                { label: 'Medical Data Policy', href: '#faq' },
                { label: 'Cookie Notice', href: '#faq' },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-zinc-900 bg-zinc-950/70 p-4">
              <p className="metric">Company Registration</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-300">
                Fighter Ready Ltd · No. 15482907
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">
                Registered in England &amp; Wales · 71-75 Shelton Street, London
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-zinc-900 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="metric">
            © {new Date().getFullYear()} Fighter Ready Ltd · All rights reserved
          </p>
          <p className="metric flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Lacing up · Launching Autumn 2026
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {show ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => scrollToId('round-00')}
            aria-label="Scroll back to the top"
            className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 border border-zinc-800 bg-carbon/90 px-3.5 py-3 backdrop-blur-md transition-colors hover:border-emerald-500/60 sm:bottom-7 sm:right-7"
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#27272a" strokeWidth="1.5" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="100"
                  style={{ strokeDashoffset: dashOffset }}
                  pathLength={100}
                />
              </svg>
              <ArrowUp
                size={13}
                strokeWidth={2.6}
                className="relative text-zinc-300 transition-colors group-hover:text-emerald-300"
              />
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                Round Up
              </span>
              <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200">
                Top
              </span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </footer>
  );
}
