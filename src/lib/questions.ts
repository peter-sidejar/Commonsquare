import type { Question, QuizSection } from "@/types/quiz";

/**
 * 30 questions from the political compass spec.
 * Interleaved ordering: E1, S1, G1, E2, S2, G2, ... E10, S10, G10
 * Each axis has 5 positive-keyed (+) and 5 negative-keyed (-) questions.
 */
export const questions: Question[] = [
  // --- Group 1 ---
  {
    id: 1,
    specId: "E1",
    text: "A strong economy depends more on free enterprise than government programs.",
    axis: "economic",
    direction: "positive",
  },
  {
    id: 2,
    specId: "S1",
    text: "Society benefits when it embraces new ideas about identity, culture, and relationships.",
    axis: "social",
    direction: "positive",
  },
  {
    id: 3,
    specId: "G1",
    text: "People should be free to make their own choices, even if experts disagree with those choices.",
    axis: "governance",
    direction: "positive",
  },

  // --- Group 2 ---
  {
    id: 4,
    specId: "E2",
    text: "Healthcare should be guaranteed by the government, even if it means higher taxes.",
    axis: "economic",
    direction: "negative",
  },
  {
    id: 5,
    specId: "S2",
    text: "Traditional family structures are important for a stable society.",
    axis: "social",
    direction: "negative",
  },
  {
    id: 6,
    specId: "G2",
    text: "Scientific experts should have more influence over public policy than they currently do.",
    axis: "governance",
    direction: "negative",
  },

  // --- Group 3 ---
  {
    id: 7,
    specId: "E3",
    text: "Businesses generally do a better job than government at creating opportunities for people.",
    axis: "economic",
    direction: "positive",
  },
  {
    id: 8,
    specId: "S3",
    text: "Drug policy should focus on treatment and personal choice, not criminal punishment.",
    axis: "social",
    direction: "positive",
  },
  {
    id: 9,
    specId: "G3",
    text: "Government surveillance programs are a greater threat to society than the problems they\u2019re designed to prevent.",
    axis: "governance",
    direction: "positive",
  },

  // --- Group 4 ---
  {
    id: 10,
    specId: "E4",
    text: "The minimum wage should be high enough that no full-time worker lives in poverty.",
    axis: "economic",
    direction: "negative",
  },
  {
    id: 11,
    specId: "S4",
    text: "Maintaining national borders and controlling immigration is essential to a country\u2019s identity.",
    axis: "social",
    direction: "negative",
  },
  {
    id: 12,
    specId: "G4",
    text: "International organizations are important for maintaining peace and cooperation between countries.",
    axis: "governance",
    direction: "negative",
  },

  // --- Group 5 ---
  {
    id: 13,
    specId: "E5",
    text: "Reducing regulations on businesses does more good than harm for the economy.",
    axis: "economic",
    direction: "positive",
  },
  {
    id: 14,
    specId: "S5",
    text: "The criminal justice system needs fundamental reform to address systemic inequities.",
    axis: "social",
    direction: "positive",
  },
  {
    id: 15,
    specId: "G5",
    text: "Most decisions that affect daily life should be made at the local level, not by the federal government.",
    axis: "governance",
    direction: "positive",
  },

  // --- Group 6 ---
  {
    id: 16,
    specId: "E6",
    text: "The government should invest more in public infrastructure, even if it increases the national debt.",
    axis: "economic",
    direction: "negative",
  },
  {
    id: 17,
    specId: "S6",
    text: "Religious and moral traditions play a valuable role in shaping public life.",
    axis: "social",
    direction: "negative",
  },
  {
    id: 18,
    specId: "G6",
    text: "A strong central government is necessary to ensure fairness and consistency across the country.",
    axis: "governance",
    direction: "negative",
  },

  // --- Group 7 ---
  {
    id: 19,
    specId: "E7",
    text: "People are generally better off when they\u2019re free to make their own economic decisions without government involvement.",
    axis: "economic",
    direction: "positive",
  },
  {
    id: 20,
    specId: "S7",
    text: "Environmental protection should be prioritized even when it comes at an economic cost.",
    axis: "social",
    direction: "positive",
  },
  {
    id: 21,
    specId: "G7",
    text: "Major news organizations do more to shape public opinion than to inform it.",
    axis: "governance",
    direction: "positive",
  },

  // --- Group 8 ---
  {
    id: 22,
    specId: "E8",
    text: "Wealthy individuals and corporations should pay significantly higher taxes to fund public services.",
    axis: "economic",
    direction: "negative",
  },
  {
    id: 23,
    specId: "S8",
    text: "The right to own firearms is a fundamental individual freedom.",
    axis: "social",
    direction: "negative",
  },
  {
    id: 24,
    specId: "G8",
    text: "The court system, despite its flaws, is the best way to resolve major social disputes.",
    axis: "governance",
    direction: "negative",
  },

  // --- Group 9 ---
  {
    id: 25,
    specId: "E9",
    text: "Free trade between countries benefits most people, even if some domestic industries lose out.",
    axis: "economic",
    direction: "positive",
  },
  {
    id: 26,
    specId: "S9",
    text: "A country is strengthened by welcoming people from diverse backgrounds and cultures.",
    axis: "social",
    direction: "positive",
  },
  {
    id: 27,
    specId: "G9",
    text: "People should have the right to keep their personal data completely private from both government and corporations.",
    axis: "governance",
    direction: "positive",
  },

  // --- Group 10 ---
  {
    id: 28,
    specId: "E10",
    text: "Public universities and trade schools should be free or heavily subsidized.",
    axis: "economic",
    direction: "negative",
  },
  {
    id: 29,
    specId: "S10",
    text: "There are important differences between men and women that society should acknowledge rather than minimize.",
    axis: "social",
    direction: "negative",
  },
  {
    id: 30,
    specId: "G10",
    text: "Large-scale problems like climate change and pandemics require coordinated institutional responses \u2014 individual action isn\u2019t enough.",
    axis: "governance",
    direction: "negative",
  },
];

/**
 * 5 sections of 6 questions each (interleaved E/S/G triplets).
 */
export const quizSections: QuizSection[] = [
  { id: 1, title: "Part 1", questionIds: [1, 2, 3, 4, 5, 6] },
  { id: 2, title: "Part 2", questionIds: [7, 8, 9, 10, 11, 12] },
  { id: 3, title: "Part 3", questionIds: [13, 14, 15, 16, 17, 18] },
  { id: 4, title: "Part 4", questionIds: [19, 20, 21, 22, 23, 24] },
  { id: 5, title: "Part 5", questionIds: [25, 26, 27, 28, 29, 30] },
];

export function getQuestionsForSection(sectionId: number): Question[] {
  const section = quizSections.find((s) => s.id === sectionId);
  if (!section) return [];
  return section.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean) as Question[];
}

/** Display labels for each axis */
export const axisLabels: Record<
  string,
  { low: string; high: string; name: string }
> = {
  economic: {
    low: "Community Investment",
    high: "Free Market",
    name: "Economic",
  },
  social: {
    low: "Traditional Values",
    high: "Progressive Values",
    name: "Social",
  },
  governance: {
    low: "Institutional Trust",
    high: "Individual Liberty",
    name: "Governance",
  },
};
