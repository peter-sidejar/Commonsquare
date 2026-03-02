/** 5-point Likert scale response (1 = Strongly Disagree, 5 = Strongly Agree) */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

/** The three political compass axes */
export type Axis = "economic" | "social" | "governance";

/** Question keying direction — determines how agreement maps to score */
export type QuestionDirection = "positive" | "negative";

export type Question = {
  /** Numeric ID used as key in the answers Map (1-30) */
  id: number;
  /** Spec reference ID like "E1", "S4", "G7" */
  specId: string;
  /** The statement text shown to the user */
  text: string;
  /** Which axis this question measures */
  axis: Axis;
  /**
   * positive: Agree → high end of axis (Free Market / Progressive / Individual Liberty)
   * negative: Agree → low end of axis (Community Investment / Traditional / Institutional Trust)
   */
  direction: QuestionDirection;
};

export type QuizAnswer = {
  questionId: number;
  value: LikertValue;
};

/** Scores are percentages 0-100 for each axis */
export type QuizScores = {
  economic: number;
  social: number;
  governance: number;
};

export type ArchetypeId =
  | "traditional-democrat"
  | "progressive"
  | "working-populist"
  | "progressive-populist"
  | "establishment-conservative"
  | "modern-moderate"
  | "constitutional-conservative"
  | "classical-liberal";

export type Archetype = {
  id: ArchetypeId;
  name: string;
  oneLiner: string;
  description: string;
  color: string;
};

export type QuizSection = {
  id: number;
  title: string;
  questionIds: number[];
};

/** Username availability check status */
export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";
