import type { Axis, LikertValue, QuizScores } from "@/types/quiz";
import { questions } from "./questions";

/**
 * Convert a Likert response (1-5) to a question score (0-4).
 *
 * Positive-keyed: SD=0, D=1, N=2, A=3, SA=4
 * Negative-keyed: SD=4, D=3, N=2, A=1, SA=0
 */
function questionScore(
  response: LikertValue,
  direction: "positive" | "negative"
): number {
  const base = response - 1; // convert 1-5 to 0-4
  return direction === "positive" ? base : 4 - base;
}

/**
 * Calculate scores for all three axes from quiz answers.
 *
 * Per axis:
 *  - Raw score = sum of 10 question scores (range 0-40)
 *  - Percentage = (raw / 40) × 100 (range 0-100)
 *  - 50% = perfectly centered
 *
 * Economic: 0 = Community Investment, 100 = Free Market
 * Social:   0 = Traditional Values,   100 = Progressive Values
 * Governance: 0 = Institutional Trust, 100 = Individual Liberty
 */
export function calculateScores(
  answers: Map<number, LikertValue>
): QuizScores {
  const rawSums: Record<Axis, number> = {
    economic: 0,
    social: 0,
    governance: 0,
  };

  const counts: Record<Axis, number> = {
    economic: 0,
    social: 0,
    governance: 0,
  };

  for (const question of questions) {
    const response = answers.get(question.id);
    if (response === undefined) continue;

    rawSums[question.axis] += questionScore(response, question.direction);
    counts[question.axis]++;
  }

  // Each axis has 10 questions, max score = 40
  // If some questions are unanswered, scale proportionally
  function axisPercentage(axis: Axis): number {
    if (counts[axis] === 0) return 50; // no data → center
    const maxPossible = counts[axis] * 4;
    return Math.round((rawSums[axis] / maxPossible) * 100);
  }

  return {
    economic: axisPercentage("economic"),
    social: axisPercentage("social"),
    governance: axisPercentage("governance"),
  };
}
