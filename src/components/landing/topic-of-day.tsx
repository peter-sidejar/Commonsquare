"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSEyebrow } from "@/components/cs/cs-eyebrow";
import { fetchTodayTopic } from "@/lib/topics";
import type { TopicRow } from "@/lib/database.types";

// Renders a teaser of the most recently published topic on the landing
// page. Returns null when no topic exists yet so the section disappears
// gracefully pre-launch.
export function LandingTopicOfDay() {
  const [topic, setTopic] = useState<TopicRow | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTodayTopic()
      .then((t) => {
        if (!cancelled) setTopic(t);
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

  return (
    <section
      id="today"
      className="px-6 py-20 md:px-16 md:py-24"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <CSEyebrow label="Today's topic" num="05" />
      <div className="mt-10 grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_auto]">
        <h2
          className="font-sans text-balance"
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "clamp(28px, 4.6vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: CS.ink,
            maxWidth: 760,
          }}
        >
          {topic.title}
        </h2>
        <Link href={`/topics/${topic.slug}`}>
          <CSButton variant="ink" size="md">
            Read both sides →
          </CSButton>
        </Link>
      </div>
      <p
        className="font-sans mt-6"
        style={{
          margin: "24px 0 0",
          fontSize: 17,
          lineHeight: 1.55,
          color: CS.mute,
          maxWidth: 700,
          letterSpacing: "-0.005em",
        }}
      >
        {topic.debate_question}
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {topic.tags.slice(0, 6).map((tag) => (
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
    </section>
  );
}
