import { EXPERIENCE, SPORTS } from './sports';
import type { ExperienceLevel, SportId, StopClass, Verdict } from './sports';

export type { Verdict, ExperienceLevel, SportId, StopClass };

export interface FighterInput {
  name: string;
  age: number;
  weightKg: number;
  experience: ExperienceLevel;
  lastStop: StopClass;
  /** Days since the fighter's most recent bout. */
  daysSinceLastBout: number;
  /** Accumulated rounds of head contact in the trailing 12 months. */
  headContactRounds: number;
}

export interface CriterionResult {
  id: string;
  label: string;
  detail: string;
  verdict: Verdict;
  /** 0–100 contribution to the confidence score. */
  score: number;
}

export interface MatchReport {
  verdict: Verdict;
  headline: string;
  summary: string;
  confidence: number;
  criteria: CriterionResult[];
}

const verdictRank: Record<Verdict, number> = { safe: 0, caution: 1, blocked: 2 };

function worst(verdicts: Verdict[]): Verdict {
  return verdicts.reduce<Verdict>(
    (acc, v) => (verdictRank[v] > verdictRank[acc] ? v : acc),
    'safe',
  );
}

/**
 * Deterministic safety evaluation. Mirrors the ruleset the platform ships with:
 * hard gates (medical rest, age, head-contact load) short-circuit to a lock,
 * soft gates (weight gap, experience spread) degrade the verdict to caution.
 */
export function evaluateMatch(
  a: FighterInput,
  b: FighterInput,
  sportId: SportId,
  restWindowDays = 0,
): MatchReport {
  const sport = SPORTS[sportId];
  const criteria: CriterionResult[] = [];

  // --- Hard gate: age eligibility ---
  const ageGap = Math.abs(a.age - b.age);
  const seniorAgeGapLimit = sportId === 'whitecollar' ? 10 : 8;
  criteria.push({
    id: 'age',
    label: 'Age Band',
    detail:
      ageGap > seniorAgeGapLimit
        ? `${ageGap}yr gap exceeds the ${seniorAgeGapLimit}yr band for ${sport.label}`
        : `${ageGap}yr gap inside the ${seniorAgeGapLimit}yr band`,
    verdict: ageGap > seniorAgeGapLimit ? 'caution' : 'safe',
    score: Math.max(0, 100 - ageGap * 7),
  });

  // --- Soft gate: weight gap ---
  const weightGap = Math.abs(a.weightKg - b.weightKg);
  const weightVerdict: Verdict =
    weightGap > sport.maxWeightGapKg
      ? 'blocked'
      : weightGap > sport.safeWeightGapKg
        ? 'caution'
        : 'safe';
  criteria.push({
    id: 'weight',
    label: 'Weight Gap',
    detail:
      weightVerdict === 'blocked'
        ? `${weightGap.toFixed(1)}kg breaches the ${sport.maxWeightGapKg}kg hard ceiling`
        : `${weightGap.toFixed(1)}kg against a ${sport.safeWeightGapKg}kg green threshold`,
    verdict: weightVerdict,
    score: Math.max(0, 100 - (weightGap / Math.max(sport.maxWeightGapKg, 0.1)) * 100),
  });

  // --- Soft gate: experience spread ---
  const expDelta = Math.abs(EXPERIENCE[a.experience].index - EXPERIENCE[b.experience].index);
  const expVerdict: Verdict = expDelta >= 3 ? 'blocked' : expDelta === 2 ? 'caution' : 'safe';
  criteria.push({
    id: 'experience',
    label: 'Experience Spread',
    detail:
      expVerdict === 'blocked'
        ? `${EXPERIENCE[a.experience].label} vs ${EXPERIENCE[b.experience].label} — non-sanctionable`
        : `${EXPERIENCE[a.experience].label} vs ${EXPERIENCE[b.experience].label} — ${expDelta} tier delta`,
    verdict: expVerdict,
    score: Math.max(0, 100 - expDelta * 33),
  });

  // --- Hard gate: governing-body medical rest ---
  const stopA = a.lastStop === 'none' ? 0 : sport.restDays[a.lastStop];
  const stopB = b.lastStop === 'none' ? 0 : sport.restDays[b.lastStop];
  const requiredRest = Math.max(stopA, stopB);
  const restRemaining = requiredRest - Math.min(a.daysSinceLastBout, b.daysSinceLastBout);
  const restVerdict: Verdict =
    requiredRest === 0 ? 'safe' : restRemaining > 0 ? 'blocked' : 'safe';
  criteria.push({
    id: 'medical',
    label: 'Medical Rest',
    detail:
      requiredRest === 0
        ? 'No active stoppage suspension on either licence'
        : restRemaining > 0
          ? `${restRemaining} days of a ${requiredRest}-day suspension still outstanding`
          : `${requiredRest}-day suspension served in full`,
    verdict: restVerdict,
    score: requiredRest === 0 ? 100 : restRemaining > 0 ? 0 : 82,
  });

  // --- Hard gate: accumulated head contact ---
  const headRounds = a.headContactRounds + b.headContactRounds;
  const headLimit = sport.headContactReviewRounds * 6;
  const headVerdict: Verdict = headRounds > headLimit ? 'blocked' : headRounds > headLimit * 0.75 ? 'caution' : 'safe';
  criteria.push({
    id: 'head-contact',
    label: 'Head Contact Load',
    detail: `${headRounds} rounds logged in 12 months against a ${headLimit}-round review ceiling`,
    verdict: headVerdict,
    score: Math.max(0, 100 - (headRounds / headLimit) * 100),
  });

  // --- Hard gate: novice vs professional ---
  const mixedClass = (a.experience === 'pro') !== (b.experience === 'pro');
  criteria.push({
    id: 'classification',
    label: 'Classification',
    detail: mixedClass
      ? 'Professional licence paired with amateur licence — not sanctionable'
      : 'Both licences held at the same classification',
    verdict: mixedClass ? 'blocked' : 'safe',
    score: mixedClass ? 0 : 100,
  });

  if (restWindowDays > 0) {
    criteria.push({
      id: 'window',
      label: 'Event Window',
      detail: `${restWindowDays} days until bout night — inside the 14-day medical submission cut-off`,
      verdict: 'caution',
      score: 46,
    });
  }

  const verdict = worst(criteria.map((c) => c.verdict));
  const confidence = Math.round(
    criteria.reduce((sum, c) => sum + c.score, 0) / Math.max(criteria.length, 1),
  );

  const headline =
    verdict === 'blocked'
      ? 'SUSPENSION LOCK — BOUT NOT SANCTIONABLE'
      : verdict === 'caution'
        ? 'CAUTION — SAFETY ADJUSTMENT REQUIRED'
        : 'SAFE MATCH — CLEARED TO SANCTION';

  const blockers = criteria.filter((c) => c.verdict === 'blocked');
  const cautions = criteria.filter((c) => c.verdict === 'caution');

  const summary =
    verdict === 'blocked'
      ? `${blockers.length} hard gate${blockers.length === 1 ? '' : 's'} failed. The engine will not generate a bout contract until each is cleared: ${blockers
          .map((c) => c.label.toLowerCase())
          .join(', ')}.`
      : verdict === 'caution'
        ? `No hard gates failed, but ${cautions.length} adjustment${cautions.length === 1 ? ' is' : 's are'} flagged. A matchmaker or medical officer must sign off before publication.`
        : 'All hard gates clear and every soft threshold sits inside tolerance. The bout can be published to the card immediately.';

  return { verdict, headline, summary, confidence, criteria };
}

export const DEMO_FIGHTER_A: FighterInput = {
  name: 'J. Okafor',
  age: 24,
  weightKg: 71.5,
  experience: 'open',
  lastStop: 'decision',
  daysSinceLastBout: 96,
  headContactRounds: 9,
};

export const DEMO_FIGHTER_B: FighterInput = {
  name: 'M. Reyes',
  age: 27,
  weightKg: 73.2,
  experience: 'open',
  lastStop: 'none',
  daysSinceLastBout: 140,
  headContactRounds: 7,
};
