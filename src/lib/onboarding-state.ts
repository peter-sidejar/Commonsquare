// Onboarding state persisted to localStorage. Mirror of the prototype's
// state shape so we can rehydrate a partial quiz across reloads. In
// production, mirror to the user row in Postgres keyed by user ID.
//
// TODO(auth): once Supabase Auth is wired in, stop persisting `email` to
// localStorage. The email should come from the session and only a
// non-PII identifier (user id) should live in localStorage.

"use client";

import { useEffect, useState } from "react";
import type { Answers, LikertValue } from "./quiz";
import { QUIZ_ORDER } from "./quiz";

export type OnboardingStep =
  | "signup"
  | "username"
  | "quiz"
  | "results"
  | "locked";

const STEP_VALUES: readonly OnboardingStep[] = [
  "signup",
  "username",
  "quiz",
  "results",
  "locked",
] as const;

export interface OnboardingState {
  step: OnboardingStep;
  email: string;
  handle: string;
  quizIndex: number;
  answers: Answers;
  showOnProfile: boolean;
}

export const ONBOARDING_KEY = "commonsquare-onboarding-v1";

export const initialState: OnboardingState = {
  step: "signup",
  email: "",
  handle: "",
  quizIndex: 0,
  answers: Array(QUIZ_ORDER.length).fill(null),
  showOnProfile: true,
};

// Coerce an unknown blob (e.g. from localStorage, which is untrusted: a
// browser extension or stale schema could put anything here) into a
// valid OnboardingState. Any unknown / out-of-range field falls back to
// the matching field on initialState.
function sanitize(raw: unknown): OnboardingState {
  if (!raw || typeof raw !== "object") return initialState;
  const p = raw as Record<string, unknown>;

  const step =
    typeof p.step === "string" &&
    (STEP_VALUES as readonly string[]).includes(p.step)
      ? (p.step as OnboardingStep)
      : initialState.step;

  const email = typeof p.email === "string" ? p.email : initialState.email;
  const handle = typeof p.handle === "string" ? p.handle : initialState.handle;

  const expectedLen = initialState.answers.length;
  const rawAnswers = Array.isArray(p.answers) ? p.answers : [];
  const answers: Answers = Array.from({ length: expectedLen }, (_, i) => {
    const a = rawAnswers[i];
    if (a === null || a === undefined) return null;
    if (typeof a === "number" && a >= 0 && a <= 4 && Number.isInteger(a)) {
      return a as LikertValue;
    }
    return null;
  });

  const quizIndexRaw =
    typeof p.quizIndex === "number" && Number.isFinite(p.quizIndex)
      ? Math.floor(p.quizIndex)
      : initialState.quizIndex;
  const quizIndex = Math.max(0, Math.min(expectedLen - 1, quizIndexRaw));

  const showOnProfile =
    typeof p.showOnProfile === "boolean"
      ? p.showOnProfile
      : initialState.showOnProfile;

  return { step, email, handle, quizIndex, answers, showOnProfile };
}

export function loadState(): OnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveState(state: OnboardingState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // ignore
  }
}

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  return { state, setState, hydrated, reset: () => setState(initialState) };
}
