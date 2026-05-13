// Quiz content + scoring. 20 questions split 7/7/6 across Economic / Social /
// Governance. Scoring: per-question contribution = (likert - 2) * dir →
// range -2..+2. Axis sum → normalized to 0..100 against per-axis max →
// snap to nearest ARCH_REF point.

import { ARCH_REF, CSArchetypes, type Archetype, type ArchetypeId } from "./archetypes";

export type Axis = "e" | "s" | "g";

export interface Question {
  axis: Axis;
  dir: 1 | -1;
  text: string;
  // Optional one-line context shown under the question. Use sparingly — only
  // when a real share of users wouldn't recognize the term. Don't editorialize.
  explainer?: string;
}

// Rewritten 2026-05-13: trimmed from 30 → 20 questions and simplified
// wording. Each question is a flat belief/value statement (no jargon, no
// "should we do more/less than today" framing). Axes still balance:
//   Economic   — 7 (3 positive, 4 negative)
//   Social     — 7 (4 positive, 3 negative)
//   Governance — 6 (3 positive, 3 negative)
// Scoring math is direction-symmetric so the unequal axis counts work
// fine — each axis normalizes against its own item count.
export const QUESTIONS: Question[] = [
  // ECONOMIC (Community Investment ←low | high→ Free Market) — 7 questions
  { axis: "e", dir: -1, text: "Roads, transit, and internet should be run by the government." },
  { axis: "e", dir: -1, text: "The rich should pay a much higher tax rate than everyone else." },
  { axis: "e", dir: +1, text: "Businesses work best when the government stays out of the way." },
  { axis: "e", dir: -1, text: "The government should guarantee healthcare for everyone." },
  { axis: "e", dir: -1, text: "Workers need unions to stand up to big companies." },
  { axis: "e", dir: +1, text: "A high minimum wage causes companies to cut jobs." },
  { axis: "e", dir: +1, text: "The economy does better with less government involvement." },

  // SOCIAL (Traditional ←low | high→ Progressive) — 7 questions
  { axis: "s", dir: -1, text: "Traditional values are worth holding onto." },
  { axis: "s", dir: +1, text: "Marginalized groups deserve stronger legal protections.", explainer: "Groups that have historically faced discrimination — by race, ethnicity, gender, sexuality, disability, etc." },
  { axis: "s", dir: -1, text: "Religion is the strongest foundation for a moral life." },
  { axis: "s", dir: -1, text: "Marriage and the traditional family hold society together." },
  { axis: "s", dir: +1, text: "Drug addiction is a health issue, not a crime." },
  { axis: "s", dir: +1, text: "People should be free to define their own gender identity." },
  { axis: "s", dir: +1, text: "Society has a duty to repair past injustices." },

  // GOVERNANCE (Institutional Trust ←low | high→ Individual Liberty) — 6 questions
  { axis: "g", dir: +1, text: "Regular people know what's best for themselves, not experts." },
  { axis: "g", dir: -1, text: "A strong society needs well-funded public institutions.", explainer: "Public schools, courts, the post office, regulatory agencies, parks, and so on." },
  { axis: "g", dir: -1, text: "Some loss of privacy is worth it if it keeps the public safer.", explainer: "Things like cameras in public spaces, online monitoring, or airport screening." },
  { axis: "g", dir: +1, text: "Getting a vaccine should be a personal choice, not a government rule." },
  { axis: "g", dir: +1, text: "The right to own a gun is a basic personal freedom." },
  { axis: "g", dir: -1, text: "Courts, the press, and government agencies usually do their jobs well." },
];

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const QUIZ_ORDER: Question[] = shuffleSeeded(QUESTIONS, 1234);

export const LIKERT = [
  { k: "Strongly disagree" },
  { k: "Disagree" },
  { k: "Neutral" },
  { k: "Agree" },
  { k: "Strongly agree" },
] as const;

export type LikertValue = 0 | 1 | 2 | 3 | 4;
export type Answers = (LikertValue | null)[];

export interface AxisScores {
  e: number;
  s: number;
  g: number;
}

export function scoreAnswers(answers: Answers): AxisScores {
  const sums: AxisScores = { e: 0, s: 0, g: 0 };
  const counts: AxisScores = { e: 0, s: 0, g: 0 };
  QUIZ_ORDER.forEach((q, i) => {
    const a = answers[i];
    if (a == null) return;
    sums[q.axis] += (a - 2) * q.dir;
    counts[q.axis] += 1;
  });
  const norm = (sum: number, ct: number) => {
    if (ct === 0) return 50;
    const max = ct * 2;
    return Math.round(((sum + max) / (2 * max)) * 100);
  };
  return {
    e: norm(sums.e, counts.e),
    s: norm(sums.s, counts.s),
    g: norm(sums.g, counts.g),
  };
}

export function pickArchetype(axes: AxisScores): Archetype {
  let best: ArchetypeId = "mm";
  let bestDist = Infinity;
  (Object.keys(ARCH_REF) as ArchetypeId[]).forEach((k) => {
    const r = ARCH_REF[k];
    const d =
      Math.pow(r.e - axes.e, 2) +
      Math.pow(r.s - axes.s, 2) +
      Math.pow(r.g - axes.g, 2);
    if (d < bestDist) {
      bestDist = d;
      best = k;
    }
  });
  const found = CSArchetypes.find((a) => a.id === best);
  if (!found) {
    // Should be unreachable — best is always a key of ARCH_REF, and every
    // ARCH_REF key has a matching entry in CSArchetypes. Fall back to "mm"
    // (Modern Moderate) so the UI never crashes.
    return CSArchetypes.find((a) => a.id === "mm") ?? CSArchetypes[0];
  }
  return found;
}
