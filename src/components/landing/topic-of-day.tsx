"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { fetchTodayTopic, fetchTopicVoteTally } from "@/lib/topics";
import type { TopicRow, TopicVoteTally } from "@/lib/database.types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Big-CTA section showing the most recently published topic. Lives near
// the top of the landing page so a first-time visitor sees real content
// before the value-prop pitch. Hides gracefully (returns null) until
// the first topic is published.
export function LandingTopicOfDay() {
  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [tally, setTally] = useState<TopicVoteTally | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTodayTopic()
      .then(async (t) => {
        if (cancelled) return;
        setTopic(t);
        if (t) {
          try {
            const tl = await fetchTopicVoteTally(t.id);
            if (!cancelled) setTally(tl);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || !topic) return null;

  const totalVotes = (tally?.yes_total ?? 0) + (tally?.no_total ?? 0);

  return (
    <section
      id="today"
      style={{
        background: CS.ink,
        color: CS.paper,
        borderTop: `1px solid ${CS.rule}`,
      }}
    >
      <div className="mx-auto w-full max-w-[1080px] px-6 py-20 md:px-16 md:py-28">
        {/* Eyebrow */}
        <div
          className="font-mono mb-6 inline-flex items-center gap-3"
          style={{
            padding: "6px 14px 6px 12px",
            borderRadius: 999,
            border: `1px solid rgba(244,241,234,0.22)`,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: CS.paper,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: CS.violet,
              boxShadow: `0 0 0 3px rgba(95,79,168,0.3)`,
            }}
          />
          Today&rsquo;s Topic · {formatDate(topic.published_at)}
        </div>

        {/* THE QUESTION — hero element */}
        <h2
          className="font-sans text-balance"
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "clamp(38px, 6.5vw, 76px)",
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: CS.paper,
            maxWidth: 940,
          }}
        >
          {topic.debate_question}
        </h2>

        {/* Title as supporting context */}
        <p
          className="font-sans"
          style={{
            margin: "28px 0 0",
            maxWidth: 720,
            fontSize: 17,
            lineHeight: 1.55,
            color: "rgba(244,241,234,0.72)",
            letterSpacing: "-0.005em",
          }}
        >
          {topic.title}
        </p>

        {/* CTA + stats row */}
        <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-7">
          <Link href={`/topics/${topic.slug}`}>
            <CSButton variant="primary" size="lg">
              Read both sides + vote →
            </CSButton>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: "rgba(244,241,234,0.6)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {totalVotes === 0
                ? "Be the first to vote"
                : `${totalVotes.toLocaleString()} ${totalVotes === 1 ? "vote" : "votes"} so far`}
            </span>
            {topic.tags.length > 0 ? (
              <>
                <span
                  aria-hidden
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 999,
                    background: "rgba(244,241,234,0.4)",
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  {topic.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "rgba(244,241,234,0.55)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Browse all topics tertiary */}
        <div className="mt-8">
          <Link
            href="/topics"
            className="font-mono"
            style={{
              fontSize: 11,
              color: "rgba(244,241,234,0.6)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← Browse all topics
          </Link>
        </div>
      </div>
    </section>
  );
}
