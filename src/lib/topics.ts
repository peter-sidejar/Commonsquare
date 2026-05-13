"use client";

import { getSupabase } from "./supabase";
import type { TopicRow, TopicVoteTally } from "./database.types";

export type Stance = "yes" | "no";

export async function fetchTopicBySlug(slug: string): Promise<TopicRow | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function fetchRecentTopics(limit = 30): Promise<TopicRow[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("topics")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchTodayTopic(): Promise<TopicRow | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("topics")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function fetchTopicVoteTally(
  topicId: string,
): Promise<TopicVoteTally | null> {
  const sb = getSupabase();
  const { data, error } = await sb.rpc("topic_vote_tally", {
    p_topic_id: topicId,
  });
  if (error) throw error;
  // RPC returns table - we get array of rows; take first
  const row = Array.isArray(data) ? data[0] : data;
  return (row as TopicVoteTally) ?? null;
}

export async function fetchMyVote(
  topicId: string,
  userId: string,
): Promise<Stance | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("topic_votes")
    .select("vote")
    .eq("topic_id", topicId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data.vote as Stance;
}

export async function castVote(input: {
  topicId: string;
  userId: string;
  archetypeId: string;
  vote: Stance;
}): Promise<void> {
  const sb = getSupabase();
  const { error } = await sb.from("topic_votes").upsert(
    {
      topic_id: input.topicId,
      user_id: input.userId,
      archetype_id: input.archetypeId,
      vote: input.vote,
    },
    { onConflict: "topic_id,user_id" },
  );
  if (error) throw error;
}
