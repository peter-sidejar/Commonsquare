"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSCompass } from "@/components/cs/cs-compass";
import { CSProcAvatar } from "@/components/cs/cs-proc-avatar";
import { CSButton } from "@/components/cs/cs-button";
import { BadgePill } from "@/components/badges/badge-pill";
import { useOnboardingState } from "@/lib/onboarding-state";
import { scoreAnswers, pickArchetype } from "@/lib/quiz";

const NAV_ITEMS: Array<{ label: string; active?: boolean; soon?: boolean }> = [
  { label: "The Lounge", active: true },
  { label: "Square", soon: true },
  { label: "Browse", soon: true },
  { label: "Leaderboard", soon: true },
  { label: "Today's Topic", soon: true },
  { label: "My Compass" },
];

function AxisRow({
  eyebrow,
  low,
  high,
  value,
  tint,
}: {
  eyebrow: string;
  low: string;
  high: string;
  value: number;
  tint: string;
}) {
  const pct = Math.max(2, Math.min(98, value));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: CS.mute,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 12,
            color: CS.ink,
          }}
        >
          {value}
        </span>
      </div>
      <div
        className="relative h-[5px] w-full"
        style={{ background: CS.rule, borderRadius: 999 }}
      >
        <div
          style={{
            position: "absolute",
            top: -2.5,
            left: `calc(${pct}% - 5px)`,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: tint,
            boxShadow: `0 0 0 3px ${tint}33`,
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-sans" style={{ fontSize: 11, color: CS.mute }}>
          {low}
        </span>
        <span className="font-sans" style={{ fontSize: 11, color: CS.mute }}>
          {high}
        </span>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="font-mono"
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: CS.ink,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          color: CS.mute,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 12, color: CS.mute, letterSpacing: "-0.005em" }}
      >
        {caption}
      </span>
    </div>
  );
}

function EmptyDebates({ handle }: { handle: string }) {
  return (
    <div
      className="flex flex-col items-start gap-4 px-6 py-10 md:px-8 md:py-12"
      style={{
        borderRadius: 14,
        background: CS.paper,
        border: `1px dashed ${CS.rule2}`,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          color: CS.mute,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Recent debates
      </span>
      <h3
        className="font-sans"
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: "-0.025em",
          color: CS.ink,
        }}
      >
        The square hasn&rsquo;t opened yet.
      </h3>
      <p
        className="font-sans"
        style={{
          margin: 0,
          maxWidth: 520,
          fontSize: 14,
          lineHeight: 1.55,
          color: CS.mute,
        }}
      >
        When matchmaking goes live, @{handle}&rsquo;s debates will land here
        with the round-by-round transcripts, audience verdicts, and ELO
        deltas. Until then your compass holds your spot.
      </p>
      <div className="flex flex-wrap gap-3">
        <span
          className="font-mono"
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: CS.violetT,
            color: CS.violetD,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Watch · coming soon
        </span>
        <span
          className="font-mono"
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(26,24,20,0.05)",
            color: CS.mute,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Vote · coming soon
        </span>
        <span
          className="font-mono"
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(26,24,20,0.05)",
            color: CS.mute,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Debate · coming soon
        </span>
      </div>
    </div>
  );
}

export default function LoungePage() {
  const router = useRouter();
  const { state, setState, hydrated } = useOnboardingState();
  const [tab, setTab] = useState<"Debates" | "Compass" | "Stats">("Debates");

  useEffect(() => {
    if (!hydrated) return;
    if (!state.email) router.replace("/signup");
    else if (!state.handle) router.replace("/username");
    else if (state.answers.some((a) => a == null)) router.replace("/quiz");
  }, [hydrated, state.email, state.handle, state.answers, router]);

  const axes = useMemo(() => scoreAnswers(state.answers), [state.answers]);
  const archetype = useMemo(() => pickArchetype(axes), [axes]);

  if (!hydrated) return null;

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* SIDEBAR — desktop */}
        <aside
          className="hidden flex-col justify-between px-5 py-7 md:flex"
          style={{
            background: CS.paper,
            borderRight: `1px solid ${CS.rule}`,
          }}
        >
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <CSMark size={22} />
              <span
                className="font-sans"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: CS.ink,
                }}
              >
                commonsquare
              </span>
            </Link>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV_ITEMS.map((it) => (
                <div
                  key={it.label}
                  className="font-sans"
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    color: it.active ? CS.ink : it.soon ? CS.mute : CS.ink,
                    background: it.active ? CS.violetT : "transparent",
                    fontWeight: it.active ? 500 : 400,
                    letterSpacing: "-0.01em",
                    cursor: it.soon ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{it.label}</span>
                  {it.soon ? (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        color: CS.mute,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      Soon
                    </span>
                  ) : null}
                </div>
              ))}
            </nav>
          </div>

          <div
            className="flex items-center gap-3 px-2"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: CS.paper2,
            }}
          >
            <CSProcAvatar
              seed={state.handle}
              size={36}
              accent={archetype.tint}
            />
            <div className="min-w-0 flex-1">
              <div
                className="font-sans truncate"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: CS.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                @{state.handle}
              </div>
              <div
                className="font-mono truncate"
                style={{
                  fontSize: 10,
                  color: CS.mute,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {state.showOnProfile ? archetype.short : "Private"}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex flex-col">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b px-5 py-4 md:hidden"
            style={{ borderColor: CS.rule }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5">
              <CSMark size={20} />
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
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              The Lounge
            </span>
          </div>

          {/* Desktop top bar */}
          <div
            className="hidden items-center justify-between border-b px-10 py-5 md:flex"
            style={{ borderColor: CS.rule }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              The Lounge · @{state.handle}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="font-sans"
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${CS.rule2}`,
                  background: "transparent",
                  color: CS.ink,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  cursor: "pointer",
                }}
              >
                Share profile
              </button>
              <CSButton variant="ink" size="sm">
                Challenge @{state.handle} →
              </CSButton>
            </div>
          </div>

          <section className="mx-auto w-full max-w-[960px] px-6 pb-32 pt-10 md:px-10 md:pt-12">
            {/* Profile header */}
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
              <div className="flex items-start gap-5 md:items-center">
                <CSProcAvatar
                  seed={state.handle}
                  size={96}
                  accent={archetype.tint}
                />
                <div className="flex flex-col gap-2">
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      letterSpacing: "-0.025em",
                      color: CS.ink,
                    }}
                  >
                    @{state.handle}
                  </span>
                  {state.showOnProfile ? (
                    <BadgePill arch={archetype} />
                  ) : (
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: CS.mute,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      Archetype hidden · only you can see it
                    </span>
                  )}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: CS.mute,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Joined just now
                  </span>
                </div>
              </div>

              <div className="hidden grid-cols-3 gap-10 md:grid">
                <StatBlock label="ELO" value="1,200" caption="Starting" />
                <StatBlock label="W–L" value="0–0" caption="No debates" />
                <StatBlock label="Streak" value="—" caption="Open the square" />
              </div>
            </div>

            {/* Mobile stats strip */}
            <div
              className="mt-7 grid grid-cols-3 gap-4 px-5 py-5 md:hidden"
              style={{
                borderRadius: 14,
                background: CS.paper2,
                border: `1px solid ${CS.rule}`,
              }}
            >
              <StatBlock label="ELO" value="1,200" caption="Starting" />
              <StatBlock label="W–L" value="0–0" caption="No debates" />
              <StatBlock label="Streak" value="—" caption="—" />
            </div>

            {/* Mobile tab strip */}
            <div className="mt-7 flex items-center gap-6 md:hidden">
              {(["Debates", "Compass", "Stats"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="font-sans"
                  style={{
                    padding: "6px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: tab === t ? 500 : 400,
                    color: tab === t ? CS.ink : CS.mute,
                    borderBottom:
                      tab === t
                        ? `2px solid ${CS.violet}`
                        : "2px solid transparent",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Compass card (desktop always; mobile via tab) */}
            <div
              className={`${tab === "Compass" ? "block" : "hidden"} mt-7 md:mt-12 md:block`}
              style={{
                borderRadius: 14,
                background: CS.paper2,
                border: `1px solid ${CS.rule}`,
                padding: "28px",
              }}
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:gap-12">
                <div className="flex justify-center">
                  <CSCompass
                    size={260}
                    x={axes.e / 100}
                    y={axes.s / 100}
                    accent={archetype.tint}
                    showArchetype={false}
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <AxisRow
                    eyebrow="Economic"
                    low="Community Investment"
                    high="Free Market"
                    value={axes.e}
                    tint={archetype.tint}
                  />
                  <AxisRow
                    eyebrow="Social"
                    low="Traditional Values"
                    high="Progressive Values"
                    value={axes.s}
                    tint={archetype.tint}
                  />
                  <AxisRow
                    eyebrow="Governance"
                    low="Institutional Trust"
                    high="Individual Liberty"
                    value={axes.g}
                    tint={archetype.tint}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Allow retake — clear answers, send back to quiz.
                      setState({
                        ...state,
                        answers: Array(state.answers.length).fill(null),
                        quizIndex: 0,
                        step: "quiz",
                      });
                      router.push("/quiz");
                    }}
                    className="font-mono self-start"
                    style={{
                      marginTop: 4,
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "transparent",
                      border: `1px solid ${CS.rule2}`,
                      color: CS.ink,
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Retake the compass
                  </button>
                </div>
              </div>
            </div>

            {/* Debates list (desktop always; mobile via tab) */}
            <div
              className={`${tab === "Debates" ? "block" : "hidden"} mt-7 md:mt-12 md:block`}
            >
              <EmptyDebates handle={state.handle} />
            </div>

            {/* Stats tab (mobile only) */}
            <div className={`${tab === "Stats" ? "block" : "hidden"} mt-7 md:hidden`}>
              <div
                className="flex flex-col gap-3 px-5 py-5"
                style={{
                  borderRadius: 14,
                  background: CS.paper2,
                  border: `1px solid ${CS.rule}`,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: CS.mute,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Waitlist position
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 28, color: CS.ink, fontWeight: 500 }}
                >
                  #2,848
                </span>
                <span
                  className="font-sans"
                  style={{ fontSize: 13, color: CS.mute }}
                >
                  We&rsquo;ll email {state.email} the moment the square opens.
                </span>
              </div>
            </div>
          </section>

          {/* Mobile sticky CTA */}
          <div
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-5 py-4 md:hidden"
            style={{ background: CS.paper, borderTop: `1px solid ${CS.rule2}` }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Square opens soon
            </span>
            <CSButton variant="primary" size="md">
              Invite a friend →
            </CSButton>
          </div>
        </div>
      </div>
    </main>
  );
}
