// Quiz content + scoring. 30 questions, 10 per axis. Locked.
// Scoring: per-question contribution = (likert - 2) * dir → range -2..+2.
// Axis sum → normalized to 0..100 → snap to nearest ARCH_REF point.

import { ARCH_REF, CSArchetypes, type Archetype, type ArchetypeId } from "./archetypes";

export type Axis = "e" | "s" | "g";

export interface Question {
  axis: Axis;
  dir: 1 | -1;
  text: string;
}

export const QUESTIONS: Question[] = [
  // ECONOMIC (Community Investment ←low | high→ Free Market)
  { axis: "e", dir: +1, text: "Markets generally produce fairer outcomes than government programs." },
  { axis: "e", dir: -1, text: "Public goods like transit and broadband are usually better delivered when government leads investment than when the private market does." },
  { axis: "e", dir: -1, text: "Taxes on the wealthy should be raised to fund public services." },
  { axis: "e", dir: +1, text: "Most economic problems are best solved by reducing regulation." },
  { axis: "e", dir: -1, text: "Universal healthcare is something markets cannot reliably provide on their own." },
  { axis: "e", dir: +1, text: "Free trade between countries usually creates more winners than losers." },
  { axis: "e", dir: -1, text: "Worker unions are essential to balance corporate power." },
  { axis: "e", dir: +1, text: "Minimum wage laws hurt more workers than they help in the long run." },
  { axis: "e", dir: -1, text: "Antitrust enforcement should be substantially more aggressive than it is today." },
  { axis: "e", dir: +1, text: "Government spending tends to crowd out productive private investment." },

  // SOCIAL (Traditional ←low | high→ Progressive)
  { axis: "s", dir: -1, text: "Society benefits when traditional institutions are preserved and respected." },
  { axis: "s", dir: +1, text: "We should expand civil rights protections for marginalized communities." },
  { axis: "s", dir: -1, text: "Religious traditions still offer the best foundation for moral life." },
  { axis: "s", dir: +1, text: "Schools should reflect a diversity of cultures and identities." },
  { axis: "s", dir: -1, text: "Family structures rooted in marriage are crucial to social stability." },
  { axis: "s", dir: +1, text: "Drug laws should be relaxed and addiction treated as a health issue." },
  { axis: "s", dir: -1, text: "Immigration policy should prioritize cultural and language assimilation." },
  { axis: "s", dir: +1, text: "People are entitled to define their own gender identity." },
  { axis: "s", dir: -1, text: "Older generations have wisdom that has been lost in modern culture." },
  { axis: "s", dir: +1, text: "Society should actively work to undo historical inequities." },

  // GOVERNANCE (Institutional Trust ←low | high→ Individual Liberty)
  { axis: "g", dir: +1, text: "Citizens are usually better judges of their own interests than government experts." },
  { axis: "g", dir: -1, text: "Strong, well-funded public institutions are essential to a functioning society." },
  { axis: "g", dir: -1, text: "Government surveillance is justified when it meaningfully improves public safety." },
  { axis: "g", dir: +1, text: "Mandatory vaccination policies overreach into personal liberty." },
  { axis: "g", dir: -1, text: "Major decisions are better made by elected representatives than by direct popular vote." },
  { axis: "g", dir: +1, text: "People should be free to make choices even if society judges them harmful." },
  { axis: "g", dir: -1, text: "Public agencies and experts deserve more trust than they currently receive." },
  { axis: "g", dir: +1, text: "Gun ownership is a fundamental right that should face minimal restrictions." },
  { axis: "g", dir: +1, text: "The federal government's role should be substantially smaller than it is today." },
  { axis: "g", dir: -1, text: "Long-standing institutions tend to know more than they appear to from the outside." },
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
  return CSArchetypes.find((a) => a.id === best)!;
}
