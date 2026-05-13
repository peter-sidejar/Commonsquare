"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { useOnboardingState } from "@/lib/onboarding-state";

const WAITLIST_COUNT = 2847; // placeholder; wire to count endpoint later

export default function SignupPage() {
  const router = useRouter();
  const { state, setState, hydrated } = useOnboardingState();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function go(nextEmail: string) {
    setState({
      ...state,
      email: nextEmail,
      step: "username",
    });
    router.push("/username");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    setSubmitting(true);
    go(trimmed);
  }

  function onGoogle() {
    // Placeholder Google OAuth handoff. In production this kicks off the
    // Supabase OAuth flow; on callback we read the email and resume the
    // onboarding state machine at the same step.
    setSubmitting(true);
    go("you@gmail.com");
  }

  if (!hydrated) return null;

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT — pitch panel */}
        <section
          className="hidden flex-col justify-between px-10 py-10 md:flex"
          style={{ background: CS.ink, color: CS.paper }}
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <CSMark size={28} ink={CS.paper} accent={CS.violet} />
            <span
              className="font-sans"
              style={{
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: CS.paper,
              }}
            >
              commonsquare
            </span>
          </Link>

          <div>
            <div
              className="font-mono mb-5 inline-flex items-center gap-2"
              style={{
                padding: "6px 12px 6px 10px",
                borderRadius: 999,
                border: `1px solid rgba(244,241,234,0.22)`,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: CS.paper,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: CS.violet,
                  boxShadow: `0 0 0 3px rgba(95,79,168,0.28)`,
                }}
              />
              Step 1 · Reserve your spot
            </div>
            <h1
              className="font-sans"
              style={{
                margin: 0,
                fontWeight: 500,
                fontSize: "clamp(40px, 5vw, 56px)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: CS.paper,
                maxWidth: 460,
              }}
            >
              The square for ideas{" "}
              <span style={{ color: CS.violet }}>opens soon.</span>
            </h1>
            <p
              className="font-sans"
              style={{
                margin: "20px 0 0",
                maxWidth: 380,
                fontSize: 16,
                lineHeight: 1.55,
                color: "rgba(244,241,234,0.72)",
              }}
            >
              Reserve a handle, take the 2-minute compass quiz, and be there
              when matchmaking opens.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["aiden", "marcus", "sarah", "jules"].map((seed, i) => (
                <div
                  key={seed}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: `rgba(244,241,234,${0.16 - i * 0.02})`,
                    border: `1px solid ${CS.ink}`,
                  }}
                />
              ))}
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: "rgba(244,241,234,0.6)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {WAITLIST_COUNT.toLocaleString()} already in line
            </div>
          </div>
        </section>

        {/* RIGHT — form panel */}
        <section className="flex flex-col px-6 py-10 md:px-16 md:py-12">
          <div className="flex items-center justify-between md:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <CSMark size={22} />
              <span
                className="font-sans"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: CS.ink,
                }}
              >
                commonsquare
              </span>
            </Link>
            <CSBadge dot>Step 1 of 4</CSBadge>
          </div>

          <div className="my-auto w-full max-w-[440px] md:mt-20">
            <div className="hidden md:block">
              <CSBadge dot>Step 1 of 4 · Sign up</CSBadge>
            </div>
            <h2
              className="font-sans"
              style={{
                margin: "28px 0 12px",
                fontWeight: 500,
                fontSize: "clamp(32px, 4vw, 44px)",
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: CS.ink,
              }}
            >
              Claim your spot in{" "}
              <span style={{ color: CS.violet }}>the square.</span>
            </h2>
            <p
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: CS.mute,
              }}
            >
              We&rsquo;ll send a magic link. No password. No noise.
            </p>

            <button
              type="button"
              onClick={onGoogle}
              disabled={submitting}
              className="font-sans mt-8 inline-flex w-full items-center justify-center gap-3 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: CS.ink,
                color: CS.paper,
                padding: "14px 18px",
                borderRadius: 12,
                border: `1px solid ${CS.ink}`,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: CS.paper,
                  color: CS.ink,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                G
              </span>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <span
                style={{ flex: 1, height: 1, background: CS.rule }}
                aria-hidden
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
                or with email
              </span>
              <span
                style={{ flex: 1, height: 1, background: CS.rule }}
                aria-hidden
              />
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: CS.mute,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@idea.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-sans"
                style={{
                  marginTop: -8,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${CS.rule2}`,
                  fontSize: 15,
                  color: CS.ink,
                  background: CS.paper,
                  outline: "none",
                }}
              />
              <CSButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
              >
                Send me a link →
              </CSButton>
              <p
                className="font-sans"
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: CS.mute,
                }}
              >
                By continuing you agree to our terms. We&rsquo;ll never sell
                your data and your quiz answers stay private to you.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
