"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { useOnboardingState } from "@/lib/onboarding-state";
import {
  QUIZ_ORDER,
  LIKERT,
  type LikertValue,
} from "@/lib/quiz";

const AXIS_LABEL: Record<string, { eyebrow: string; low: string; high: string }> = {
  e: {
    eyebrow: "Economic",
    low: "Community Investment",
    high: "Free Market",
  },
  s: {
    eyebrow: "Social",
    low: "Traditional Values",
    high: "Progressive Values",
  },
  g: {
    eyebrow: "Governance",
    low: "Institutional Trust",
    high: "Individual Liberty",
  },
};

const AUTO_ADVANCE_MS = 220;

export default function QuizPage() {
  const router = useRouter();
  const { state, setState, hydrated } = useOnboardingState();
  const [i, setI] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Quiz is open to anyone — no auth gate. The answers live in localStorage
  // and are converted into a profile row at /username after sign-in.

  // Resume at last unanswered (or last index touched).
  useEffect(() => {
    if (!hydrated) return;
    const firstUnanswered = state.answers.findIndex((a) => a == null);
    setI(firstUnanswered === -1 ? state.answers.length - 1 : firstUnanswered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const q = QUIZ_ORDER[i];
  const axis = q ? AXIS_LABEL[q.axis] : null;
  const current = state.answers[i];
  const answeredCount = state.answers.filter((a) => a != null).length;

  function recordAndAdvance(v: LikertValue) {
    if (transitioning) return;
    const next = state.answers.slice();
    next[i] = v;
    setState({ ...state, answers: next, quizIndex: i });
    setTransitioning(true);
    window.setTimeout(() => {
      if (i >= QUIZ_ORDER.length - 1) {
        setState({
          ...state,
          answers: next,
          quizIndex: i,
          step: "results",
        });
        router.push("/results");
      } else {
        setI((n) => n + 1);
        setTransitioning(false);
      }
    }, AUTO_ADVANCE_MS);
  }

  function goBack() {
    if (transitioning) return;
    if (i > 0) setI(i - 1);
  }

  function goNext() {
    if (transitioning) return;
    if (current == null) return;
    if (i >= QUIZ_ORDER.length - 1) {
      setState({ ...state, step: "results" });
      router.push("/results");
    } else {
      setI(i + 1);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5") {
        const v = (parseInt(e.key, 10) - 1) as LikertValue;
        recordAndAdvance(v);
      } else if (e.key === "ArrowLeft") {
        goBack();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, state.answers, transitioning]);

  if (!hydrated || !q || !axis) return null;

  const progressPct = (answeredCount / QUIZ_ORDER.length) * 100;

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      {/* Header row */}
      <div className="px-5 pt-5 md:px-8 md:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CSMark size={20} />
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {axis.eyebrow}
            </span>
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: 999,
                background: CS.rule2,
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: CS.ink,
                letterSpacing: "0.14em",
              }}
            >
              {i + 1}/{QUIZ_ORDER.length}
            </span>
          </div>
          <span
            className="font-mono hidden md:inline"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            ~2 minutes total
          </span>
        </div>
        <div
          className="relative mt-4 h-[2px] w-full"
          style={{ background: CS.rule }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: CS.violet,
              transition: "width 220ms ease",
            }}
          />
        </div>
      </div>

      {/* Question body */}
      <section className="mx-auto flex w-full max-w-[900px] flex-col px-6 pb-32 pt-12 md:px-0 md:pt-20">
        <div className="mb-8 flex items-center gap-3">
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.violet,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {axis.low}
          </span>
          <span
            aria-hidden
            style={{ flex: 1, height: 1, background: CS.rule }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {axis.high}
          </span>
        </div>

        <h1
          className="font-sans text-balance"
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "clamp(22px, 3.4vw, 38px)",
            lineHeight: 1.18,
            letterSpacing: "-0.025em",
            color: CS.ink,
          }}
        >
          {q.text}
        </h1>
        {q.explainer ? (
          <p
            className="font-sans"
            style={{
              margin: "16px 0 0",
              maxWidth: 700,
              fontSize: 14,
              lineHeight: 1.5,
              color: CS.mute,
              letterSpacing: "-0.005em",
            }}
          >
            {q.explainer}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-2 md:mt-12 md:flex-row md:gap-3">
          {LIKERT.map((opt, idx) => {
            const selected = current === idx;
            return (
              <button
                key={opt.k}
                type="button"
                onClick={() => recordAndAdvance(idx as LikertValue)}
                disabled={transitioning}
                className="font-sans group flex-1 transition-all"
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: selected
                    ? `1.5px solid ${CS.violet}`
                    : `1px solid ${CS.rule2}`,
                  background: selected ? CS.violet : CS.paper,
                  color: selected ? CS.paper : CS.ink,
                  cursor: transitioning ? "not-allowed" : "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  minHeight: 64,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: selected ? "rgba(244,241,234,0.7)" : CS.mute,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {idx + 1}
                </span>
                <span>{opt.k}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 md:px-8"
        style={{ background: CS.paper, borderTop: `1px solid ${CS.rule}` }}
      >
        <button
          type="button"
          onClick={goBack}
          disabled={i === 0}
          className="font-sans transition-opacity hover:opacity-80 disabled:opacity-30"
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: `1px solid ${CS.rule2}`,
            background: "transparent",
            color: CS.ink,
            fontSize: 13,
            fontWeight: 500,
            cursor: i === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Back
        </button>
        <span
          className="font-mono hidden md:inline"
          style={{
            fontSize: 11,
            color: CS.mute,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          1–5 to answer · ← back · → next
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={current == null}
          className="font-sans transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: `1px solid ${CS.violet}`,
            background: CS.violet,
            color: CS.paper,
            fontSize: 13,
            fontWeight: 500,
            cursor: current == null ? "not-allowed" : "pointer",
          }}
        >
          {i === QUIZ_ORDER.length - 1 ? "See results →" : "Next →"}
        </button>
      </div>
    </main>
  );
}
