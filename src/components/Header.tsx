'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight, Swords } from 'lucide-react';
import { NAV_ITEMS } from '@/data/content';
import { cn, scrollToId } from '@/lib/utils';

const LAUNCH_PERCENT = 97;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('round-00');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      {/* ---------- Launch status strip ---------- */}
      <div className="relative z-50 overflow-hidden border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-3 px-4 py-2 sm:px-6">
          <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald-400" />
          </span>
          <p className="metric-bright shrink-0">Launching Autumn 2026</p>
          <div className="hidden h-3 w-px shrink-0 bg-zinc-800 sm:block" aria-hidden />
          <p className="metric hidden truncate sm:block">
            Early-access waves open by role · Coaches and officials first
          </p>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="metric hidden md:inline">Lacing Up</span>
            <div
              className="relative h-1 w-24 overflow-hidden bg-zinc-800 sm:w-40"
              role="progressbar"
              aria-valuenow={LAUNCH_PERCENT}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Platform launch readiness"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${LAUNCH_PERCENT}%` }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-emerald-500"
              />
            </div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-emerald-400">
              {LAUNCH_PERCENT}%
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Sticky nav ---------- */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-colors duration-300',
          scrolled
            ? 'border-zinc-900 bg-carbon/85 backdrop-blur-xl'
            : 'border-transparent bg-carbon',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6"
        >
          <button
            type="button"
            onClick={() => go('round-00')}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Fighter Ready — back to top"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
              <Swords size={15} strokeWidth={2.4} />
            </span>
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-100">
              Fighter<span className="text-emerald-400">Ready</span>
            </span>
          </button>

          <div className="mx-auto hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  'relative px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200',
                  active === item.id ? 'text-emerald-300' : 'text-zinc-500 hover:text-zinc-200',
                )}
              >
                {item.label}
                {active === item.id ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-1 -bottom-px h-px bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <button
              type="button"
              onClick={() => go('round-07')}
              className="btn-primary clip-notch hidden px-4 py-2.5 sm:inline-flex"
            >
              Early Access
              <ArrowUpRight size={13} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white xl:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400"
          aria-hidden
        />

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-zinc-900 bg-carbon xl:hidden"
            >
              <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px px-4 py-4 sm:grid-cols-2 sm:px-6">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      className="flex w-full items-center justify-between border border-zinc-900 px-4 py-3.5 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
                    >
                      {item.label}
                      <span className="text-[10px] text-zinc-600">{item.round}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-6 sm:px-6">
                <button
                  type="button"
                  onClick={() => go('round-07')}
                  className="btn-primary clip-notch w-full"
                >
                  Claim Early Access
                  <ArrowUpRight size={13} strokeWidth={2.4} />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
