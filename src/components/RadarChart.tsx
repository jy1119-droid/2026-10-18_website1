'use client';

import { useId } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Attribute } from '@/data/features';

interface Props {
  attributes: Attribute[];
  size?: number;
  label: string;
}

function point(index: number, total: number, radius: number, cx: number, cy: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as const;
}

export default function RadarChart({ attributes, size = 340, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const uid = useId().replace(/[:]/g, '');

  const total = attributes.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 46;
  const rings = [0.25, 0.5, 0.75, 1];

  const polygon = (scale: number) =>
    attributes
      .map((_, i) => point(i, total, maxR * scale, cx, cy).join(','))
      .join(' ');

  const dataPolygon = attributes
    .map((a, i) => point(i, total, maxR * (a.value / 100), cx, cy).join(','))
    .join(' ');

  return (
    <div ref={ref} className="flex w-full flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        role="img"
        aria-label={label}
        className="max-w-[380px] overflow-visible"
      >
        <defs>
          <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* Rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={polygon(r)}
            fill="none"
            stroke="#27272a"
            strokeWidth={r === 1 ? 1.2 : 0.8}
          />
        ))}

        {/* Spokes */}
        {attributes.map((a, i) => {
          const [x, y] = point(i, total, maxR, cx, cy);
          return (
            <line key={a.key} x1={cx} y1={cy} x2={x} y2={y} stroke="#27272a" strokeWidth={0.8} />
          );
        })}

        {/* Data */}
        <motion.polygon
          points={dataPolygon}
          fill={`url(#fill-${uid})`}
          stroke="#10b981"
          strokeWidth={1.8}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Vertices */}
        {attributes.map((a, i) => {
          const [x, y] = point(i, total, maxR * (a.value / 100), cx, cy);
          return (
            <motion.circle
              key={a.key}
              cx={x}
              cy={y}
              r={3.2}
              fill="#09090b"
              stroke="#34d399"
              strokeWidth={1.8}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
            />
          );
        })}

        {/* Axis labels */}
        {attributes.map((a, i) => {
          const [x, y] = point(i, total, maxR + 26, cx, cy);
          const anchor = Math.abs(x - cx) < 12 ? 'middle' : x > cx ? 'start' : 'end';
          return (
            <motion.text
              key={a.key}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
              className="fill-zinc-500 font-mono text-[9px] uppercase"
              style={{ letterSpacing: '0.14em', fontSize: 9 }}
            >
              {a.label}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}
