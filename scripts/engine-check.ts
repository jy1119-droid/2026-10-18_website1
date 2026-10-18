/**
 * Sanity checks for the matchmaking engine and form validation.
 * Run via `npm run test:engine`, which compiles these modules to CommonJS first.
 */
import { SPORT_LIST } from '../src/lib/sports';
import { DEMO_FIGHTER_A, DEMO_FIGHTER_B, evaluateMatch } from '../src/lib/matchmaking';
import type { FighterInput } from '../src/lib/matchmaking';
import { isValidEmail, validateEarlyAccess } from '../src/lib/validation';

const base: FighterInput = {
  name: 'X',
  age: 25,
  weightKg: 70,
  experience: 'open',
  lastStop: 'none',
  daysSinceLastBout: 200,
  headContactRounds: 5,
};

let failures = 0;
function check(label: string, got: unknown, want: unknown) {
  const ok = got === want;
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} -> ${String(got)}${ok ? '' : ` (want ${String(want)})`}`);
}

/* ---------- Verdicts: weight tolerance ---------- */
check('clean match', evaluateMatch(base, { ...base, weightKg: 70.5 }, 'boxing').verdict, 'safe');
check('2.5kg gap / boxing', evaluateMatch(base, { ...base, weightKg: 72.5 }, 'boxing').verdict, 'caution');
check('3.5kg gap / boxing', evaluateMatch(base, { ...base, weightKg: 73.5 }, 'boxing').verdict, 'blocked');
check('3.0kg gap / white-collar', evaluateMatch(base, { ...base, weightKg: 73 }, 'whitecollar').verdict, 'safe');
check('3.0kg gap / boxing', evaluateMatch(base, { ...base, weightKg: 73 }, 'boxing').verdict, 'caution');

/* ---------- Governing-body rest ladder ---------- */
check(
  'KO rest outstanding',
  evaluateMatch({ ...base, lastStop: 'ko', daysSinceLastBout: 100 }, base, 'boxing').verdict,
  'blocked',
);
check(
  'KO rest served',
  evaluateMatch({ ...base, lastStop: 'ko', daysSinceLastBout: 190 }, base, 'boxing').verdict,
  'safe',
);
check(
  'MMA TKO 100d',
  evaluateMatch({ ...base, lastStop: 'tko', daysSinceLastBout: 100 }, base, 'mma').verdict,
  'blocked',
);
check(
  'MMA TKO 130d',
  evaluateMatch({ ...base, lastStop: 'tko', daysSinceLastBout: 130 }, base, 'mma').verdict,
  'safe',
);
check(
  'WC points loss 60d',
  evaluateMatch({ ...base, lastStop: 'decision', daysSinceLastBout: 60 }, base, 'whitecollar').verdict,
  'blocked',
);
check(
  'BOX points loss 40d',
  evaluateMatch({ ...base, lastStop: 'decision', daysSinceLastBout: 40 }, base, 'boxing').verdict,
  'safe',
);

/* ---------- Classification and experience ---------- */
check('pro vs amateur', evaluateMatch({ ...base, experience: 'pro' }, base, 'boxing').verdict, 'blocked');
check(
  'novice vs elite',
  evaluateMatch({ ...base, experience: 'novice' }, { ...base, experience: 'elite' }, 'boxing').verdict,
  'caution',
);
check(
  'novice vs pro',
  evaluateMatch({ ...base, experience: 'novice' }, { ...base, experience: 'pro' }, 'boxing').verdict,
  'blocked',
);

/* ---------- Head-contact accumulation ---------- */
check(
  'head contact 19rds',
  evaluateMatch({ ...base, headContactRounds: 12 }, { ...base, headContactRounds: 7 }, 'boxing').verdict,
  'blocked',
);
check(
  'head contact 16rds',
  evaluateMatch({ ...base, headContactRounds: 9 }, { ...base, headContactRounds: 7 }, 'boxing').verdict,
  'caution',
);
check(
  'head contact 8rds',
  evaluateMatch({ ...base, headContactRounds: 4 }, { ...base, headContactRounds: 4 }, 'boxing').verdict,
  'safe',
);

/* ---------- Age band ---------- */
check('age gap 12', evaluateMatch({ ...base, age: 20 }, { ...base, age: 32 }, 'boxing').verdict, 'caution');
check('age gap 4', evaluateMatch({ ...base, age: 22 }, { ...base, age: 26 }, 'boxing').verdict, 'safe');

/* ---------- Hero card must agree with the engine ---------- */
check('hero demo pair', evaluateMatch(DEMO_FIGHTER_A, DEMO_FIGHTER_B, 'boxing').verdict, 'caution');

/* ---------- Every discipline blocks a 10kg gap ---------- */
SPORT_LIST.forEach((s) =>
  check(`10kg gap blocked (${s.short})`, evaluateMatch(base, { ...base, weightKg: 80 }, s.id).verdict, 'blocked'),
);

/* ---------- Report invariants ---------- */
check(
  'deterministic output',
  JSON.stringify(evaluateMatch(base, { ...base, weightKg: 72.5 }, 'boxing')) ===
    JSON.stringify(evaluateMatch(base, { ...base, weightKg: 72.5 }, 'boxing')),
  true,
);

const reports = SPORT_LIST.flatMap((s) => [
  evaluateMatch(base, { ...base, weightKg: 95, experience: 'pro', lastStop: 'ko' }, s.id),
  evaluateMatch(base, base, s.id),
]);
check('confidence within 0-100', reports.every((r) => r.confidence >= 0 && r.confidence <= 100), true);
check('every report has 6 gates', reports.every((r) => r.criteria.length === 6), true);
check(
  'blocked reports name a failing gate',
  reports
    .filter((r) => r.verdict === 'blocked')
    .every((r) => r.criteria.some((c) => c.verdict === 'blocked')),
  true,
);
check('event window adds a 7th gate', evaluateMatch(base, base, 'boxing', 10).criteria.length === 7, true);
check(
  'single caution copy is grammatical',
  evaluateMatch(base, { ...base, age: 37 }, 'boxing').summary.includes('1 adjustment is flagged'),
  true,
);
check(
  'multiple caution copy is grammatical',
  evaluateMatch({ ...base, age: 20, headContactRounds: 9 }, { ...base, age: 32, headContactRounds: 7 }, 'boxing')
    .summary.includes('2 adjustments are flagged'),
  true,
);

/* ---------- Form validation ---------- */
check('valid email', isValidEmail('coach@club.com'), true);
check('email without TLD', isValidEmail('coach@club'), false);
check('email without @', isValidEmail('coach.club.com'), false);
check('empty email', isValidEmail(''), false);
check('email with inner space', isValidEmail('a b@club.com'), false);
check(
  'valid draft',
  Object.keys(validateEarlyAccess({ name: 'Alex Morgan', email: 'a@b.co', club: '' })).length,
  0,
);
check(
  'short name rejected',
  validateEarlyAccess({ name: 'A', email: 'a@b.co', club: '' }).name,
  'Enter your full name',
);
check(
  'blank name rejected',
  validateEarlyAccess({ name: '   ', email: 'a@b.co', club: '' }).name,
  'Enter your full name',
);
check(
  'bad email rejected',
  validateEarlyAccess({ name: 'Alex Morgan', email: 'nope', club: '' }).email,
  'Enter a valid email address',
);
check(
  'club is optional',
  validateEarlyAccess({ name: 'Alex Morgan', email: 'a@b.co', club: '' }).club,
  undefined,
);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
