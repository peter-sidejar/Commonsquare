"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import {
  castVote,
  fetchMyVote,
  fetchTopicBySlug,
  fetchTopicVoteTally,
  type Stance,
} from "@/lib/topics";
import { fetchMyProfile } from "@/lib/profile";
import { useSession } from "@/lib/use-session";
import type {
  TopicRow,
  TopicSource,
  TopicVoteTally,
} from "@/lib/database.types";
import { CSArchetypes, type ArchetypeId } from "@/lib/archetypes";

// Bias label → grayscale dot color. Five-point scale, no red/blue.
// The point of the dot is to register "leans more" or "leans less", not
// which side. Color = neutral, position in the card = which side.
const BIAS_DOT: Record<string, string> = {
  Left: CS.ink,
  "Lean Left": "rgba(26,24,20,0.7)",
  Center: CS.mute,
  "Lean Right": "rgba(26,24,20,0.7)",
  Right: CS.ink,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function SourceCard({ source }: { source: TopicSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-opacity hover:opacity-90"
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        background: CS.paper,
        border: `1px solid ${CS.rule}`,
        textDecoration: "none",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: BIAS_DOT[source.bias_label] ?? CS.mute,
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: CS.mute,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {source.outlet} · {source.bias_label}
        </span>
      </div>
      <div
        className="font-sans"
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: CS.ink,
          letterSpacing: "-0.015em",
          lineHeight: 1.35,
          marginBottom: source.excerpt ? 8 : 0,
        }}
      >
        {source.title}
      </div>
      {source.excerpt ? (
        <div
          className="font-sans"
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: CS.mute,
            letterSpacing: "-0.005em",
          }}
        >
          “{source.excerpt}”
        </div>
      ) : null}
    </a>
  );
}

function SideColumn({
  side,
  summary,
  sources,
}: {
  side: "left" | "right";
  summary: string;
  sources: TopicSource[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: side === "left" ? "flex-start" : "flex-end",
            width: 28,
            height: 14,
            border: `1px solid ${CS.rule2}`,
            borderRadius: 999,
            background: CS.paper,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: CS.ink,
              margin: "0 2px",
            }}
          />
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: CS.ink,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {side === "left" ? "Left-leaning coverage" : "Right-leaning coverage"}
        </span>
      </div>
      <p
        className="font-sans"
        style={{
          margin: 0,
          fontSize: 16,
          lineHeight: 1.6,
          color: CS.ink,
          letterSpacing: "-0.005em",
        }}
      >
        {summary}
      </p>
      <div className="flex flex-col gap-3">
        {sources.map((s, i) => (
          <SourceCard key={`${s.url}-${i}`} source={s} />
        ))}
      </div>
    </div>
  );
}

function VoteBar({
  yes,
  no,
  myVote,
}: {
  yes: number;
  no: number;
  myVote: Stance | null;
}) {
  const total = yes + no;
  const yesPct = total === 0 ? 50 : Math.round((yes / total) * 100);
  const noPct = 100 - yesPct;
  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative flex w-full overflow-hidden"
        style={{
          height: 44,
          borderRadius: 12,
          border: `1px solid ${CS.rule2}`,
        }}
      >
        <div
          style={{
            width: `${yesPct}%`,
            background: myVote === "yes" ? CS.violet : CS.ink,
            transition: "width 0.4s ease",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              color: CS.paper,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Yes · {yesPct}%
          </span>
        </div>
        <div
          style={{
            width: `${noPct}%`,
            background: myVote === "no" ? CS.violet : CS.paper2,
            transition: "width 0.4s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 14px",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              color: myVote === "no" ? CS.paper : CS.ink,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {noPct}% · No
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: CS.mute,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {total.toLocaleString()} vote{total === 1 ? "" : "s"}
        </span>
        {myVote ? (
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.violetD,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            You voted {myVote === "yes" ? "Yes" : "No"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { session, loading: loadingSession } = useSession();

  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tally, setTally] = useState<TopicVoteTally | null>(null);
  const [myVote, setMyVote] = useState<Stance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [archetypeId, setArchetypeId] = useState<ArchetypeId | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTopicBySlug(params.slug)
      .then((t) => {
        if (cancelled) return;
        if (!t) {
          setNotFound(true);
        } else {
          setTopic(t);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingTopic(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const refreshTally = useCallback(async (topicId: string) => {
    try {
      const t = await fetchTopicVoteTally(topicId);
      setTally(t);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!topic) return;
    refreshTally(topic.id);
  }, [topic, refreshTally]);

  useEffect(() => {
    if (!topic || !session?.user) return;
    let cancelled = false;
    fetchMyVote(topic.id, session.user.id)
      .then((v) => {
        if (!cancelled) setMyVote(v);
      })
      .catch(console.error);
    fetchMyProfile(session.user.id)
      .then((p) => {
        if (!cancelled && p)
          setArchetypeId(p.archetype_id as ArchetypeId);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [topic, session]);

  async function onVote(stance: Stance) {
    if (!topic) return;
    if (!session?.user || !archetypeId) {
      setShowSignupPrompt(true);
      return;
    }
    setSubmitting(true);
    try {
      await castVote({
        topicId: topic.id,
        userId: session.user.id,
        archetypeId,
        vote: stance,
      });
      setMyVote(stance);
      await refreshTally(topic.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const archetypeBreakdown = useMemo(() => {
    if (!myVote || !tally) return null;
    const yes = (tally.yes_by_archetype ?? {}) as Record<string, number>;
    const no = (tally.no_by_archetype ?? {}) as Record<string, number>;
    return CSArchetypes.map((a) => {
      const y = yes[a.id] ?? 0;
      const n = no[a.id] ?? 0;
      const t = y + n;
      const pct = t === 0 ? null : Math.round((y / t) * 100);
      return { archetype: a, yes: y, no: n, total: t, yesPct: pct };
    }).filter((row) => row.total > 0);
  }, [myVote, tally]);

  if (loadingTopic) return null;

  if (notFound || !topic) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center px-6"
        style={{ background: CS.paper }}
      >
        <CSMark size={36} />
        <h1
          className="font-sans"
          style={{
            margin: "24px 0 10px",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: CS.ink,
          }}
        >
          Topic not found.
        </h1>
        <p
          className="font-sans"
          style={{ margin: 0, fontSize: 15, color: CS.mute }}
        >
          It may have been archived. Browse the index for what&rsquo;s live.
        </p>
        <div className="mt-6">
          <Link href="/topics">
            <CSButton variant="primary" size="md">
              All topics →
            </CSButton>
          </Link>
        </div>
      </main>
    );
  }

  // The DB column is `jsonb` (Json). The API route Zod-validates the shape
  // on insert, so by the time it lands here it conforms to TopicSource[].
  const leftSources = (topic.left_sources as unknown as TopicSource[]) ?? [];
  const rightSources = (topic.right_sources as unknown as TopicSource[]) ?? [];
  const todayBadge = isToday(topic.published_at);

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-5 md:px-16 md:py-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <CSMark size={26} />
          <span
            className="font-sans"
            style={{
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: CS.ink,
            }}
          >
            commonsquare
          </span>
        </Link>
        <Link href="/topics">
          <CSButton size="sm" variant="ghost">
            All topics →
          </CSButton>
        </Link>
      </div>

      <article className="mx-auto w-full max-w-[920px] px-6 pb-24 pt-8 md:px-10">
        {/* Eyebrow */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {todayBadge ? <CSBadge dot>Today&rsquo;s Topic</CSBadge> : null}
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {formatDate(topic.published_at)}
          </span>
          {topic.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="font-mono"
              style={{
                fontSize: 10,
                color: CS.mute,
                padding: "4px 10px",
                borderRadius: 999,
                background: CS.paper2,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="font-sans text-balance"
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: CS.ink,
          }}
        >
          {topic.title}
        </h1>

        {/* Question + vote */}
        <section
          className="mt-10 flex flex-col gap-6 px-6 py-7 md:px-8"
          style={{
            background: CS.paper2,
            border: `1px solid ${CS.rule}`,
            borderRadius: 18,
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.violetD,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            The question
          </div>
          <h2
            className="font-sans text-balance"
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "clamp(22px, 3.4vw, 32px)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: CS.ink,
            }}
          >
            {topic.debate_question}
          </h2>

          {!myVote ? (
            <div className="flex flex-col gap-3 md:flex-row">
              <CSButton
                variant="ink"
                size="lg"
                onClick={() => onVote("yes")}
                disabled={submitting}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Yes
              </CSButton>
              <CSButton
                variant="ghost"
                size="lg"
                onClick={() => onVote("no")}
                disabled={submitting}
                style={{ flex: 1, justifyContent: "center" }}
              >
                No
              </CSButton>
            </div>
          ) : (
            <VoteBar
              yes={tally?.yes_total ?? 0}
              no={tally?.no_total ?? 0}
              myVote={myVote}
            />
          )}

          <p
            className="font-sans"
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.55,
              color: CS.mute,
            }}
          >
            {myVote
              ? "You can change your vote any time. One vote per account."
              : loadingSession
                ? "Loading…"
                : session
                  ? "One vote per account. You can change it any time."
                  : "Voting requires an account so we can keep polls real. Free to join."}
          </p>
        </section>

        {/* Background */}
        <section className="mt-14">
          <div
            className="font-mono mb-3"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Background
          </div>
          <p
            className="font-sans"
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.65,
              color: CS.ink,
              letterSpacing: "-0.005em",
              whiteSpace: "pre-line",
            }}
          >
            {topic.background}
          </p>
        </section>

        {/* How each side sees it */}
        <section className="mt-14">
          <div
            className="font-mono mb-3"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            How each side covers this
          </div>
          <p
            className="font-sans mb-10"
            style={{
              margin: "0 0 36px",
              fontSize: 14,
              lineHeight: 1.55,
              color: CS.mute,
              maxWidth: 600,
            }}
          >
            Both columns use the same layout. The framing, language, and
            emphasis are the substance.
          </p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
            <SideColumn
              side="left"
              summary={topic.left_summary}
              sources={leftSources}
            />
            <SideColumn
              side="right"
              summary={topic.right_summary}
              sources={rightSources}
            />
          </div>
        </section>

        {/* Archetype breakdown */}
        {archetypeBreakdown && archetypeBreakdown.length > 0 ? (
          <section className="mt-16">
            <div
              className="font-mono mb-5"
              style={{
                fontSize: 11,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              How each archetype voted
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {archetypeBreakdown.map((row) => (
                <div
                  key={row.archetype.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    background: CS.paper,
                    border: `1px solid ${CS.rule}`,
                    borderRadius: 12,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: row.archetype.tint,
                      flex: "0 0 auto",
                    }}
                  />
                  <span
                    className="font-sans flex-1"
                    style={{
                      fontSize: 13,
                      color: CS.ink,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {row.archetype.n}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: CS.mute,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {row.yesPct ?? 0}% YES · {row.total} vote
                    {row.total === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Final CTA */}
        <section
          className="mt-16 flex flex-col gap-4 px-6 py-7 md:px-8"
          style={{
            background: CS.ink,
            color: CS.paper,
            borderRadius: 18,
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: "rgba(244,241,234,0.6)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Have a take?
          </div>
          <h3
            className="font-sans"
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 28px)",
              letterSpacing: "-0.025em",
              color: CS.paper,
              lineHeight: 1.2,
            }}
          >
            Take the compass. See where you actually stand.
          </h3>
          <p
            className="font-sans"
            style={{
              margin: 0,
              maxWidth: 520,
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(244,241,234,0.72)",
            }}
          >
            22 questions, two minutes. Your archetype is yours alone — only
            the label is shareable.
          </p>
          <div>
            <Link href="/quiz">
              <CSButton variant="primary" size="md">
                Take the Compass →
              </CSButton>
            </Link>
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <Link href="/topics">
            <CSButton variant="ghost" size="md">
              ← All topics
            </CSButton>
          </Link>
        </div>
      </article>

      {/* Signup prompt modal */}
      {showSignupPrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(26,24,20,0.55)" }}
          onClick={() => setShowSignupPrompt(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[440px] flex-col gap-4 p-7"
            style={{
              background: CS.paper,
              borderRadius: 18,
              border: `1px solid ${CS.rule2}`,
            }}
          >
            <CSBadge dot>Voting requires an account</CSBadge>
            <h3
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: CS.ink,
              }}
            >
              Take the compass first.
            </h3>
            <p
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: CS.mute,
              }}
            >
              Two minutes. You&rsquo;ll get your archetype, then your vote
              counts toward the breakdown by archetype on this topic. One
              person, one vote — keeps the polls real.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CSButton
                variant="primary"
                size="md"
                onClick={() => router.push("/quiz")}
              >
                Take the Compass →
              </CSButton>
              <CSButton
                variant="ghost"
                size="md"
                onClick={() => setShowSignupPrompt(false)}
              >
                Not now
              </CSButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
