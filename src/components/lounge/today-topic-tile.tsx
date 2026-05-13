"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { fetchTodayTopic, fetchMyVote } from "@/lib/topics";
import type { TopicRow } from "@/lib/database.types";

interface Props {
  userId?: string;
}

// Compact "today's topic" tile for the lounge. Shows the latest topic with
// vote status if the user has voted, or a Vote CTA otherwise. Returns null
// gracefully when there's no published topic yet.
export function TodayTopicTile({ userId }: Props) {
  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTodayTopic()
      .then(async (t) => {
        if (cancelled) return;
        setTopic(t);
        if (t && userId) {
          try {
            const v = await fetchMyVote(t.id, userId);
            if (!cancelled) setVoted(v !== null);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!loaded || !topic) return null;

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="flex flex-col gap-4 transition-opacity hover:opacity-95"
      style={{
        padding: "22px 24px",
        background: CS.ink,
        color: CS.paper,
        borderRadius: 14,
        textDecoration: "none",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono inline-flex items-center gap-2"
          style={{
            fontSize: 10,
            color: "rgba(244,241,234,0.7)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: CS.violet,
              boxShadow: `0 0 0 3px rgba(95,79,168,0.3)`,
              display: "inline-block",
            }}
          />
          Today&rsquo;s topic
        </span>
        {voted ? (
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: "rgba(244,241,234,0.55)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            You voted
          </span>
        ) : null}
      </div>
      <h3
        className="font-sans"
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "clamp(18px, 2.4vw, 22px)",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
          color: CS.paper,
        }}
      >
        {topic.debate_question}
      </h3>
      <div className="mt-1 flex items-center justify-between">
        <span
          className="font-sans"
          style={{
            fontSize: 13,
            color: "rgba(244,241,234,0.72)",
          }}
        >
          Read both sides, vote, see how each archetype came down.
        </span>
        <CSButton variant="primary" size="sm">
          {voted ? "Open" : "Vote"} →
        </CSButton>
      </div>
    </Link>
  );
}
