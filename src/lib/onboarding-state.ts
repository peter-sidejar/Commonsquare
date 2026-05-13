// Onboarding state persisted to localStorage. Mirror of the prototype's
// state shape so we can rehydrate a partial quiz across reloads. In
// production, mirror to the user row in Postgres keyed by user ID.

"use client";

import { useEffect, useState } from "react";
import type { Answers } from "./quiz";

export type OnboardingStep =
  | "signup"
  | "username"
  | "quiz"
  | "results"
  | "locked";

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
  answers: Array(30).fill(null),
  showOnProfile: true,
};

export function loadState(): OnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return { ...initialState, ...parsed };
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
