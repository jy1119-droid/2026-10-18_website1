# Fighter Ready

Marketing and product-preview site for **Fighter Ready** — a safety-gated
matchmaking platform for combat sports.

> Matchmaking with an opinion.

The site is a single scrolling page structured as fight rounds (Round 00 through
Round 08). It is a Next.js App Router project written in TypeScript, styled with
Tailwind CSS and animated with Framer Motion. It builds to a fully static export.

## Getting started

```bash
npm install
npm run dev      # http://localhost:12000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 12000 |
| `npm run build` | Static export to `out/`, then mirrors it to the repo root |
| `npm start` | Serves the built export from `out/` on port 12000 |
| `npm run test:engine` | Compiles and runs the matchmaking/validation check suite |
| `npm run export:root` | Re-mirrors `out/` to the repo root without rebuilding |

`npm run build` also writes `index.html` to the project root so the page can be
served from the root folder directly.

## Page structure

| Round | Section | Component |
| --- | --- | --- |
| Status | Launch progress bar, "Lacing Up 97%" | `components/Header.tsx` |
| 00 | Overview / hero, lead capture | `sections/Hero.tsx` |
| 01 | The Problem (bento grid) | `sections/Problem.tsx` |
| 02 | Matchmaking engine (interactive) | `sections/Matchmaking.tsx` |
| 03 | Sparring finder | `sections/Sparring.tsx` |
| 04 | Coach assessment / radar chart | `sections/Assessment.tsx` |
| 05 | Fighter profile | `sections/Profile.tsx` |
| 06 | Event builder & BoutPass ticketing | `sections/Events.tsx` |
| 07 | Who it's for + early access form | `sections/WhoItsFor.tsx` |
| 08 | FAQ accordion | `sections/Faq.tsx` |

## The matchmaking engine

`src/lib/matchmaking.ts` scores a prospective bout across six weighted gates:

1. **Age band** — maximum age separation per discipline
2. **Weight gap** — green threshold, amber tolerance, hard ceiling in kg
3. **Experience spread** — tier delta between the two fighters
4. **Medical rest** — governing-body suspension ladder (KO / TKO / points)
5. **Head-contact load** — rounds accumulated in a rolling 12-month window
6. **Classification** — licence class must match (amateur cannot meet pro)

Each gate returns its own `safe` / `caution` / `blocked` verdict plus a 0–100
contribution. The **lowest-scoring gate drives the overall verdict**, so a single
hard failure can never be averaged away by strong scores elsewhere. Passing a
seventh argument adds an event-window gate.

Rulesets differ per discipline — a 3 kg gap is safe in white-collar but a caution
in amateur boxing, and the medical rest ladder ranges from 30 to 180 days.

The hero card and the Round 02 demo both read from the same `DEMO_FIGHTER_A` /
`DEMO_FIGHTER_B` inputs, so the two sections can never disagree.

### Checks

```bash
npm run test:engine
```

Covers every gate, all five disciplines, the rest ladder boundaries, verdict
determinism, report invariants and form validation. 41 checks.

## Design system

- **Base**: carbon `#09090b` (`bg-zinc-950`), `zinc-800` hairline borders
- **Accents**: emerald (safe), amber (caution), rose (hard gate), white
- **Type**: Inter for headlines, JetBrains Mono for uppercase metrics — both
  self-hosted via `next/font`, no runtime request to Google
- **Signature components**: `VerdictBadge` (traffic-light verdict),
  `TrafficLights`, `PillSwitcher` (sport filter), `Counter` (animated numbers),
  `RoundHeader` (round framing), all in `src/components/ui.tsx`

## Accessibility

- Skip-to-content link, semantic landmarks and `aria-label` on every section
- Accordion uses `aria-expanded` / `aria-controls` with labelled regions
- Switchers are toggle groups (`aria-pressed`); the audience tabs are a proper
  `tablist` with linked `tabpanel`s
- Visible focus rings, `prefers-reduced-motion` respected throughout
- All form controls are labelled; validation messages are announced inline

## Notes

- `output: 'export'` — the site is fully static, no server runtime required
- Junior/minor fighter data is pseudonymous by design; see the Round 03 and
  Round 08 privacy copy
