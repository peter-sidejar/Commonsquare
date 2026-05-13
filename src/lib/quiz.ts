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

// Items adapted (2026-05-13) from published, validated political-typology
// instruments. Source citations per question are below. Plain-language tone
// preserved; no "should we do more/less than today" framing; no proper
// nouns. Keying balance preserved:
//   Economic   — 7 (3 positive [+], 4 negative [-])
//   Social     — 7 (4 positive [+], 3 negative [-])
//   Governance — 6 (3 positive [+], 3 negative [-])
//
// Primary sources:
//   • Pew Research Center, "Beyond Red vs. Blue: The 2021 Political Typology"
//     https://www.pewresearch.org/politics/2021/11/09/beyond-red-vs-blue-the-political-typology/
//     — and the long-running Pew political-values battery (1990s–present).
//   • Moral Foundations Questionnaire (MFQ-30), Graham, Haidt, et al.
//     https://moralfoundations.org/questionnaires/
//   • Iyer, Koleva, Graham, Ditto & Haidt (2012), "Understanding Libertarian
//     Morality," PLOS ONE 7(8): e42366. Liberty foundation scale.
//   • World Values Survey Wave 7 (2017–2022), master questionnaire.
//     https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp
//   • American National Election Studies (ANES) trust-in-government battery
//     (1958–present).
//
// Each axis was checked for discriminator coverage between adjacent
// archetypes (e.g. Working Populist vs. Constitutional Conservative on
// Economic; Establishment Conservative vs. Constitutional Conservative on
// Governance; Traditional Democrat vs. Progressive on Social). Known gaps
// for a future pass: no foreign-policy item; no welfare-safety-net item;
// no factor analysis yet to confirm the three axes load distinctly.
export const QUESTIONS: Question[] = [
  // ECONOMIC (Community Investment ←low | high→ Free Market) — 7 questions
  // E1 [-] Pew typology populist-vs-establishment item
  { axis: "e", dir: -1, text: "The economic system in this country unfairly favors powerful interests." },
  // E2 [+] Pew political-values battery, canonical (since 1990s)
  { axis: "e", dir: +1, text: "Government regulation of business usually does more harm than good." },
  // E3 [-] Pew 2021 typology healthcare-coverage item (deferralized)
  { axis: "e", dir: -1, text: "Government should make sure everyone has access to healthcare." },
  // E4 [+] Pew political-values battery, meritocracy belief
  { axis: "e", dir: +1, text: "People succeed in life mostly because of their own hard work, not the help they get." },
  // E5 [-] Adapted from Pew 2021 typology progressive-taxation item
  //        (reframed to avoid "than they do today" baseline framing)
  { axis: "e", dir: -1, text: "The wealthy should pay a higher share of their income in taxes than working-class people." },
  // E6 [+] Adapted from Pew "Government is almost always wasteful and inefficient"
  { axis: "e", dir: +1, text: "When government tries to fix problems, it usually creates more problems than it solves." },
  // E7 [-] Adapted from Pew labor-unions-favorable item
  { axis: "e", dir: -1, text: "Workers would be better off if more of them belonged to unions." },

  // SOCIAL (Traditional ←low | high→ Progressive) — 7 questions
  // S1 [-] World Values Survey Wave 7, item V154 (verbatim)
  { axis: "s", dir: -1, text: "A child needs both a mother and a father in the home to grow up happily." },
  // S2 [+] Pew typology + long-running Pew "Homosexuality should be accepted"
  //        item, broadened to include gender identity
  { axis: "s", dir: +1, text: "Society should accept people who are gay, lesbian, or transgender." },
  // S3 [-] Pew 2021 typology Q2 (proper-noun de-Americanized)
  { axis: "s", dir: -1, text: "If we are too open to people from other countries, we risk losing our identity as a nation." },
  // S4 [+] Pew 2021 typology Q5 (broadened beyond Black/white framing)
  { axis: "s", dir: +1, text: "Much more needs to be done to ensure equal rights for people of all races." },
  // S5 [-] Pew + WVS V152 "necessary to believe in God to be moral"
  { axis: "s", dir: -1, text: "Belief in God is necessary for a person to be a good and moral citizen." },
  // S6 [+] Iyer et al. (2012), MFQ Liberty lifestyle-subfactor item
  { axis: "s", dir: +1, text: "People should be free to live by their own values, even when those values differ from tradition." },
  // S7 [+] WVS self-expression values cluster Y010 / Schwartz openness-to-change
  { axis: "s", dir: +1, text: "It is important to keep an open mind about new ideas and different ways of life." },

  // GOVERNANCE (Institutional Trust ←low | high→ Individual Liberty) — 6 questions
  // G1 [-] MFQ-30 Authority foundation, Part 2 (verbatim)
  { axis: "g", dir: -1, text: "Respect for authority is something all children need to learn." },
  // G2 [+] Iyer et al. (2012), MFQ Liberty foundation, government-liberty (verbatim)
  { axis: "g", dir: +1, text: "The government interferes far too much in our everyday lives." },
  // G3 [-] Pew 2021 typology Q3, populist-vs-establishment expert-trust item
  { axis: "g", dir: -1, text: "When making policy decisions, experts who study an issue usually know better than the average person." },
  // G4 [+] Pew civil-liberties-vs-security paired battery
  { axis: "g", dir: +1, text: "It is more important to protect people's privacy than to give law enforcement the tools it needs to keep us safe." },
  // G5 [-] ANES trust-in-government, generalized to public institutions
  { axis: "g", dir: -1, text: "Most public institutions can be trusted to do what is right most of the time.", explainer: "Public institutions means things like courts, schools, health agencies, and elected governments." },
  // G6 [+] Iyer et al. (2012), MFQ Liberty foundation, lifestyle-liberty
  { axis: "g", dir: +1, text: "People should be free to make their own decisions, even when others believe those choices are wrong." },
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
