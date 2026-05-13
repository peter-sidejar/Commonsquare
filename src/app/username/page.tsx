"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { OnboardingTopRow } from "@/components/onboarding/top-row";
import { useOnboardingState } from "@/lib/onboarding-state";

const RX = /^[a-z0-9._]{3,18}$/;
const TAKEN = new Set([
  "admin",
  "commonsquare",
  "mod",
  "moderator",
  "support",
  "marcus",
  "sarah",
  "peter",
  "founder",
]);

const SUGGESTIONS = ["arena.aiden", "civic.jules", "vox.morgan", "case_built", "quiet.skeptic"];

type Status = "idle" | "checking" | "available" | "taken" | "invalid";

export default function UsernamePage() {
  const router = useRouter();
  const { state, setState, hydrated } = useOnboardingState();
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Redirect back to signup if we don't have an email yet.
  useEffect(() => {
    if (hydrated && !state.email) router.replace("/signup");
  }, [hydrated, state.email, router]);

  // Rehydrate handle from saved state on first paint.
  useEffect(() => {
    if (hydrated && state.handle && !handle) setHandle(state.handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Debounced "uniqueness" check (mocked locally).
  useEffect(() => {
    if (!handle) {
      setStatus("idle");
      return;
    }
    if (!RX.test(handle)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    const t = setTimeout(() => {
      if (TAKEN.has(handle)) setStatus("taken");
      else setStatus("available");
    }, 240);
    return () => clearTimeout(t);
  }, [handle]);

  const canSubmit = status === "available";

  function onChange(v: string) {
    // strip everything but allowed chars, lowercase
    const clean = v.toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 18);
    setHandle(clean);
  }

  function claim() {
    if (!canSubmit) return;
    setState({ ...state, handle, step: "quiz" });
    router.push("/quiz");
  }

  const rightLabel = useMemo(() => {
    if (status === "available")
      return { text: "Available", color: CS.violet, bg: CS.violetT };
    if (status === "taken")
      return { text: "Taken", color: CS.ink, bg: "rgba(26,24,20,0.06)" };
    if (status === "checking")
      return { text: "Checking…", color: CS.mute, bg: "rgba(26,24,20,0.05)" };
    if (status === "invalid")
      return { text: "Not valid", color: CS.mute, bg: "rgba(26,24,20,0.05)" };
    return null;
  }, [status]);

  if (!hydrated) return null;

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      <OnboardingTopRow step="Step 2 of 4" backHref="/signup" />
      <section className="mx-auto w-full max-w-[640px] px-6 pb-16 pt-10 md:px-0 md:pt-16">
        <CSBadge dot>Step 2 · Claim your handle</CSBadge>
        <h1
          className="font-sans"
          style={{
            margin: "20px 0 12px",
            fontWeight: 500,
            fontSize: "clamp(32px, 4.4vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: CS.ink,
          }}
        >
          Lock in your handle{" "}
          <span style={{ color: CS.violet }}>
            before someone else does.
          </span>
        </h1>
        <p
          className="font-sans"
          style={{
            margin: "0 0 28px",
            fontSize: 15,
            lineHeight: 1.55,
            color: CS.mute,
          }}
        >
          This is what other debaters and the audience will see. Choose
          something you&rsquo;d be proud to ship a debate under.
        </p>

        <div
          className="flex items-center"
          style={{
            height: 66,
            padding: "4px 12px 4px 16px",
            borderRadius: 14,
            border:
              status === "available"
                ? `1.5px solid ${CS.violet}66`
                : `1px solid ${CS.rule2}`,
            background: CS.paper,
            transition: "border-color 0.15s ease",
          }}
        >
          <span
            className="font-sans"
            style={{
              fontSize: 22,
              color: CS.mute,
              letterSpacing: "-0.02em",
              marginRight: 2,
            }}
          >
            @
          </span>
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoFocus
            spellCheck={false}
            placeholder="your_handle"
            value={handle}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) claim();
            }}
            className="font-sans flex-1"
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: CS.ink,
              background: "transparent",
              outline: "none",
              border: "none",
              padding: 0,
              minWidth: 0,
            }}
          />
          {rightLabel ? (
            <span
              className="font-mono"
              style={{
                marginLeft: 12,
                padding: "5px 10px",
                borderRadius: 999,
                background: rightLabel.bg,
                color: rightLabel.color,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: status === "taken" ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {rightLabel.text}
            </span>
          ) : null}
        </div>

        <p
          className="font-mono"
          style={{
            margin: "10px 0 0",
            fontSize: 11,
            color: CS.mute,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          3–18 chars · letters, numbers, periods, underscores
        </p>

        <div className="mt-8">
          <div
            className="font-mono mb-3"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Try one of these
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHandle(s)}
                className="font-sans transition-colors hover:opacity-90"
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: CS.paper2,
                  border: `1px solid ${CS.rule}`,
                  color: CS.ink,
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                }}
              >
                @{s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CSButton
            variant="primary"
            size="lg"
            disabled={!canSubmit}
            onClick={claim}
          >
            {handle ? `Claim @${handle}` : "Claim your handle"} →
          </CSButton>
          <span
            className="font-sans"
            style={{ fontSize: 13, color: CS.mute }}
          >
            You can change your display name later. Your handle is forever.
          </span>
        </div>
      </section>
    </main>
  );
}
