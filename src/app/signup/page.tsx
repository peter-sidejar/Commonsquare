"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { getSupabase } from "@/lib/supabase";
import { useSession } from "@/lib/use-session";

const WAITLIST_COUNT = 2847; // placeholder; wire to a count query later

export default function SignupPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Skip ahead.
  useEffect(() => {
    if (!loading && session) router.replace("/auth/callback");
  }, [loading, session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("That email doesn't look right.");
      return;
    }
    setSubmitting(true);
    try {
      const sb = getSupabase();
      const { error: e } = await sb.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (e) throw e;
      setSentTo(trimmed);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't send the magic link. Try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

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

            {sentTo ? (
              <>
                <h2
                  className="font-sans"
                  style={{
                    margin: "28px 0 12px",
                    fontWeight: 500,
                    fontSize: "clamp(28px, 3.6vw, 38px)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.035em",
                    color: CS.ink,
                  }}
                >
                  Check your inbox.
                </h2>
                <p
                  className="font-sans"
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: CS.mute,
                  }}
                >
                  We sent a magic link to{" "}
                  <span style={{ color: CS.ink, fontWeight: 500 }}>
                    {sentTo}
                  </span>
                  . Click it from this device and you&rsquo;ll land back here,
                  signed in.
                </p>
                <div
                  className="mt-8 flex flex-col gap-3 px-5 py-5"
                  style={{
                    background: CS.violetT,
                    border: `1px solid ${CS.violet}33`,
                    borderRadius: 14,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: CS.violetD,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Tip
                  </span>
                  <p
                    className="font-sans"
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: CS.ink,
                    }}
                  >
                    Magic links can take up to a minute. Check your spam
                    folder if it doesn&rsquo;t show up.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSentTo(null);
                    setEmail("");
                  }}
                  className="font-sans mt-6"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: `1px solid ${CS.rule2}`,
                    background: "transparent",
                    color: CS.ink,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Use a different email
                </button>
              </>
            ) : (
              <>
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
                  disabled
                  title="Coming soon"
                  className="font-sans mt-8 inline-flex w-full items-center justify-center gap-3"
                  style={{
                    background: CS.ink,
                    color: CS.paper,
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: `1px solid ${CS.ink}`,
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    cursor: "not-allowed",
                    opacity: 0.5,
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
                  <span
                    className="font-mono"
                    style={{
                      marginLeft: 8,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(244,241,234,0.18)",
                      color: CS.paper,
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Soon
                  </span>
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
                    {submitting ? "Sending…" : "Send me a link →"}
                  </CSButton>
                  {error ? (
                    <p
                      className="font-sans"
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: CS.ink,
                        background: "rgba(26,24,20,0.06)",
                        padding: "10px 12px",
                        borderRadius: 10,
                      }}
                    >
                      {error}
                    </p>
                  ) : null}
                  <p
                    className="font-sans"
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: CS.mute,
                    }}
                  >
                    By continuing you agree to our terms. We&rsquo;ll never
                    sell your data and your quiz answers stay private to you.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
