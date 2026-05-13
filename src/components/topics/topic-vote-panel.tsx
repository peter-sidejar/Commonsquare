"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { castVote, fetchMyVote, fetchTopicVoteTally } from "@/lib/topics";
import type { Stance } from "@/lib/topics";
import { fetchMyProfile } from "@/lib/profile";
import { useSession } from "@/lib/use-session";
import { CSArchetypes, type ArchetypeId } from "@/lib/archetypes";
import type { TopicVoteTally } from "@/lib/database.types";

interface Props {
  topicId: string;
  question: string;
  initialTally: TopicVoteTally | null;
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
  const noPct = total === 0 ? 50 : 100 - yesPct;
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
            width: total === 0 ? "50%" : `${yesPct}%`,
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
            width: total === 0 ? "50%" : `${noPct}%`,
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

export function TopicVotePanel({ topicId, question, initialTally }: Props) {
  const router = useRouter();
  const { session, loading: loadingSession } = useSession();
  const [tally, setTally] = useState<TopicVoteTally | null>(initialTally);
  const [myVote, setMyVote] = useState<Stance | null>(null);
  const [archetypeId, setArchetypeId] = useState<ArchetypeId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const refreshTally = useCallback(async () => {
    try {
      const t = await fetchTopicVoteTally(topicId);
      setTally(t);
    } catch (err) {
      console.error(err);
    }
  }, [topicId]);

  useEffect(() => {
    if (!session?.user) {
      setMyVote(null);
      setArchetypeId(null);
      return;
    }
    let cancelled = false;
    fetchMyVote(topicId, session.user.id)
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
  }, [session, topicId]);

  async function onVote(stance: Stance) {
    if (!session?.user || !archetypeId) {
      setShowSignupPrompt(true);
      return;
    }
    setSubmitting(true);
    try {
      await castVote({
        topicId,
        userId: session.user.id,
        archetypeId,
        vote: stance,
      });
      setMyVote(stance);
      await refreshTally();
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

  const hasTallyData =
    tally && (tally.yes_total > 0 || tally.no_total > 0);
  const showVoteButtons = !loadingSession && !myVote;

  return (
    <>
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
          {question}
        </h2>

        {/* Always show the tally, even pre-vote and anon. */}
        {hasTallyData ? (
          <VoteBar
            yes={tally?.yes_total ?? 0}
            no={tally?.no_total ?? 0}
            myVote={myVote}
          />
        ) : (
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px 0",
            }}
          >
            No votes yet · be the first
          </div>
        )}

        {/* Vote buttons appear pre-vote (anon + signed-in-no-vote). */}
        {showVoteButtons ? (
          <div className="flex flex-col gap-3 md:flex-row">
            <CSButton
              variant="ink"
              size="lg"
              onClick={() => onVote("yes")}
              disabled={submitting}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Vote Yes
            </CSButton>
            <CSButton
              variant="ghost"
              size="lg"
              onClick={() => onVote("no")}
              disabled={submitting}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Vote No
            </CSButton>
          </div>
        ) : null}

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
                : "Anyone can read and see results. Voting requires an account so we can keep polls real and show breakdown by archetype."}
        </p>
      </section>

      {/* Archetype breakdown — only after voting */}
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
    </>
  );
}
