// Quiz content + scoring. 30 questions, 10 per axis. Locked.
// Scoring: per-question contribution = (likert - 2) * dir → range -2..+2.
// Axis sum → normalized to 0..100 → snap to nearest ARCH_REF point.

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

// Rewritten 2026-05-13: every question now asks about a belief or value
// directly rather than asking about a delta from current policy. No jargon
// without an explainer, no "more / less than today" phrasing.
export const QUESTIONS: Question[] = [
  // ECONOMIC (Community Investment ←low | high→ Free Market)
  { axis: "e", dir: +1, text: "A free market produces better results than a government-planned economy." },
  { axis: "e", dir: -1, text: "Things like roads, transit, and internet access should be run by the government, not private companies." },
  { axis: "e", dir: -1, text: "It's fair for the wealthy to pay a much higher rate of tax than everyone else." },
  { axis: "e", dir: +1, text: "Businesses do their best work when government rules stay out of the way." },
  { axis: "e", dir: -1, text: "Healthcare is a basic right, and the government should make sure everyone has it." },
  { axis: "e", dir: +1, text: "Open trade between countries makes everyone better off in the long run." },
  { axis: "e", dir: -1, text: "Workers need unions to stand up to big companies." },
  { axis: "e", dir: +1, text: "A high minimum wage ends up costing more jobs than it lifts people out of poverty." },
  { axis: "e", dir: -1, text: "When a few companies dominate an industry, the government should step in to break them up.", explainer: "Like if one company controlled most of the search, social media, or grocery market." },
  { axis: "e", dir: +1, text: "The bigger the government's role in the economy, the worse the economy does overall." },

  // SOCIAL (Traditional ←low | high→ Progressive)
  { axis: "s", dir: -1, text: "Traditional values and institutions are worth holding onto." },
  { axis: "s", dir: +1, text: "Marginalized groups deserve stronger legal protections.", explainer: "Groups that have historically faced discrimination — by race, ethnicity, gender, sexuality, disability, etc." },
  { axis: "s", dir: -1, text: "Religion and faith still provide the strongest foundation for a moral life." },
  { axis: "s", dir: +1, text: "Schools should teach kids about a wide range of cultures and identities." },
  { axis: "s", dir: -1, text: "Marriage and the traditional family are the foundation of a stable society." },
  { axis: "s", dir: +1, text: "Drug addiction is a health issue, not a crime." },
  { axis: "s", dir: -1, text: "Immigrants should be expected to adopt the language and customs of their new country." },
  { axis: "s", dir: +1, text: "People should be free to define their own gender identity." },
  { axis: "s", dir: -1, text: "Older generations had more wisdom about life than today's culture gives them credit for." },
  { axis: "s", dir: +1, text: "Society has a real duty to repair the harms of historical injustices." },

  // GOVERNANCE (Institutional Trust ←low | high→ Individual Liberty)
  { axis: "g", dir: +1, text: "Regular people usually know what's best for themselves better than government experts do." },
  { axis: "g", dir: -1, text: "A functioning society needs strong, well-funded public institutions.", explainer: "Public schools, courts, the post office, regulatory agencies, parks, and so on." },
  { axis: "g", dir: -1, text: "Some loss of privacy is worth it if it makes the public safer.", explainer: "Things like cameras in public spaces, online monitoring, or airport screening." },
  { axis: "g", dir: +1, text: "Decisions like whether to get a vaccine should be up to the individual, not the government." },
  { axis: "g", dir: -1, text: "Big national decisions should be made by elected leaders, not by direct popular vote." },
  { axis: "g", dir: +1, text: "People should be free to make their own choices even when others think they're harmful." },
  { axis: "g", dir: -1, text: "When scientists and government experts give advice, people should generally trust them." },
  { axis: "g", dir: +1, text: "The right to own a gun is a basic personal freedom." },
  { axis: "g", dir: +1, text: "The federal government has too much say in everyday life." },
  { axis: "g", dir: -1, text: "Institutions like courts, the press, and government agencies usually do their jobs well." },
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
