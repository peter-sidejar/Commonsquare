"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { fetchRecentTopics } from "@/lib/topics";
import type { TopicRow } from "@/lib/database.types";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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

function TopicCard({ topic, featured }: { topic: TopicRow; featured?: boolean }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="flex flex-col gap-4 transition-opacity hover:opacity-90"
      style={{
        padding: featured ? "32px 28px" : "22px 20px",
        background: CS.paper,
        border: `1px solid ${CS.rule}`,
        borderRadius: 14,
        textDecoration: "none",
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isToday(topic.published_at) ? (
          <CSBadge dot>Today</CSBadge>
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
            {formatShortDate(topic.published_at)}
          </span>
        )}
        {topic.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: 10,
              color: CS.mute,
              padding: "3px 9px",
              borderRadius: 999,
              background: CS.paper2,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <h2
        className="font-sans text-balance"
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: featured
            ? "clamp(26px, 3.6vw, 36px)"
            : "clamp(18px, 2.4vw, 22px)",
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          color: CS.ink,
        }}
      >
        {topic.title}
      </h2>
      <p
        className="font-sans"
        style={{
          margin: 0,
          fontSize: featured ? 16 : 14,
          lineHeight: 1.5,
          color: CS.mute,
          letterSpacing: "-0.005em",
        }}
      >
        {topic.debate_question}
      </p>
      <div
        className="font-mono"
        style={{
          fontSize: 11,
          color: CS.violetD,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        Read both sides →
      </div>
    </Link>
  );
}

export default function TopicsIndexPage() {
  const [topics, setTopics] = useState<TopicRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchRecentTopics(60)
      .then((rows) => {
        if (!cancelled) setTopics(rows);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Couldn't load topics.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!topics) return null;
    if (!query.trim()) return topics;
    const q = query.toLowerCase();
    return topics.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        t.debate_question.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [topics, query]);

  const featured = filtered && filtered.length > 0 ? filtered[0] : null;
  const rest = filtered && filtered.length > 1 ? filtered.slice(1) : [];

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
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
        <Link href="/quiz">
          <CSButton size="sm" variant="ink">
            Take the Compass
          </CSButton>
        </Link>
      </div>

      <section className="mx-auto w-full max-w-[1080px] px-6 pb-20 pt-6 md:px-10">
        <CSBadge dot>The square · topics</CSBadge>
        <h1
          className="font-sans text-balance"
          style={{
            margin: "20px 0 14px",
            fontWeight: 500,
            fontSize: "clamp(36px, 5.6vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: CS.ink,
          }}
        >
          One debate{" "}
          <span style={{ color: CS.violet }}>worth having</span>, every day.
        </h1>
        <p
          className="font-sans"
          style={{
            margin: "0 0 36px",
            maxWidth: 640,
            fontSize: 17,
            lineHeight: 1.55,
            color: CS.mute,
          }}
        >
          The most debatable story from the day&rsquo;s news, with both
          sides&rsquo; framing side-by-side. Read it, vote on the question,
          see how each archetype came down.
        </p>

        <div
          className="mb-10 flex items-center gap-3 px-4"
          style={{
            height: 52,
            background: CS.paper,
            border: `1px solid ${CS.rule2}`,
            borderRadius: 12,
            maxWidth: 460,
          }}
        >
          <span
            aria-hidden
            className="font-mono"
            style={{
              fontSize: 13,
              color: CS.mute,
              letterSpacing: "0.02em",
            }}
          >
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, tags, questions…"
            className="font-sans flex-1"
            style={{
              fontSize: 15,
              color: CS.ink,
              background: "transparent",
              outline: "none",
              border: "none",
              padding: 0,
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-mono"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: CS.mute,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: 0,
              }}
            >
              Clear
            </button>
          ) : null}
        </div>

        {error ? (
          <p
            className="font-sans"
            style={{
              fontSize: 14,
              color: CS.ink,
              background: "rgba(26,24,20,0.06)",
              padding: "12px 14px",
              borderRadius: 10,
            }}
          >
            {error}
          </p>
        ) : topics === null ? (
          <p
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Loading topics…
          </p>
        ) : filtered && filtered.length === 0 ? (
          <div
            className="flex flex-col gap-3 px-6 py-10 text-center"
            style={{
              borderRadius: 14,
              background: CS.paper,
              border: `1px dashed ${CS.rule2}`,
            }}
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
              {query ? "No matches" : "No topics yet"}
            </span>
            <p
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 15,
                color: CS.ink,
                letterSpacing: "-0.005em",
              }}
            >
              {query
                ? `Nothing on "${query}" yet. Try a different search.`
                : "The first topic lands here when it publishes. Check back tomorrow."}
            </p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mb-8">
                <TopicCard topic={featured} featured />
              </div>
            ) : null}
            {rest.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {rest.map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
