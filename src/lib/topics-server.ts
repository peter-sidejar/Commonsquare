import { createAnonServerClient } from "./supabase-anon-server";
import type {
  CommentWithAuthor,
  TopicRow,
  TopicVoteTally,
} from "./database.types";

export type CommentSort = "top" | "new" | "controversial";

// Server-only topic fetchers. Used by the SSR page to populate initial
// content for SEO + first paint. Client components take over from there
// for live updates.

export async function getTopicBySlugServer(
  slug: string,
): Promise<TopicRow | null> {
  const sb = createAnonServerClient();
  const { data, error } = await sb
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("getTopicBySlugServer error", error);
    return null;
  }
  return data;
}

export async function getTopicVoteTallyServer(
  topicId: string,
): Promise<TopicVoteTally | null> {
  const sb = createAnonServerClient();
  const { data, error } = await sb.rpc("topic_vote_tally", {
    p_topic_id: topicId,
  });
  if (error) {
    console.error("getTopicVoteTallyServer error", error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return (row as TopicVoteTally) ?? null;
}

export async function getTopicCommentsServer(
  topicId: string,
  sort: CommentSort = "top",
  limit = 100,
): Promise<CommentWithAuthor[]> {
  const sb = createAnonServerClient();
  const { data, error } = await sb.rpc("topic_comments_with_author", {
    p_topic_id: topicId,
    p_sort: sort,
    p_limit: limit,
  });
  if (error) {
    console.error("getTopicCommentsServer error", error);
    return [];
  }
  return (data ?? []) as CommentWithAuthor[];
}
