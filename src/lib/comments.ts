"use client";

import { getSupabase } from "./supabase";
import type { CommentWithAuthor } from "./database.types";
import type { CommentSort } from "./topics-server";

export type { CommentSort };

export async function fetchComments(
  topicId: string,
  sort: CommentSort = "top",
  limit = 100,
): Promise<CommentWithAuthor[]> {
  const sb = getSupabase();
  const { data, error } = await sb.rpc("topic_comments_with_author", {
    p_topic_id: topicId,
    p_sort: sort,
    p_limit: limit,
  });
  if (error) throw error;
  return (data ?? []) as CommentWithAuthor[];
}

export async function fetchMyCommentVotes(
  userId: string,
  commentIds: string[],
): Promise<Map<string, 1 | -1>> {
  if (commentIds.length === 0) return new Map();
  const sb = getSupabase();
  const { data, error } = await sb
    .from("comment_votes")
    .select("comment_id, value")
    .eq("user_id", userId)
    .in("comment_id", commentIds);
  if (error) throw error;
  const m = new Map<string, 1 | -1>();
  for (const row of data ?? []) {
    m.set(row.comment_id, row.value === 1 ? 1 : -1);
  }
  return m;
}

export interface PostCommentInput {
  topicId: string;
  userId: string;
  archetypeId: string;
  body: string;
  parentId?: string | null;
}

export async function postComment(input: PostCommentInput) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("topic_comments")
    .insert({
      topic_id: input.topicId,
      user_id: input.userId,
      archetype_id: input.archetypeId,
      body: input.body,
      parent_id: input.parentId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function voteComment(input: {
  commentId: string;
  userId: string;
  value: 1 | -1 | 0; // 0 = remove vote
}) {
  const sb = getSupabase();
  if (input.value === 0) {
    const { error } = await sb
      .from("comment_votes")
      .delete()
      .eq("comment_id", input.commentId)
      .eq("user_id", input.userId);
    if (error) throw error;
    return;
  }
  const { error } = await sb.from("comment_votes").upsert(
    {
      comment_id: input.commentId,
      user_id: input.userId,
      value: input.value,
    },
    { onConflict: "comment_id,user_id" },
  );
  if (error) throw error;
}

export async function softDeleteComment(input: {
  commentId: string;
  userId: string;
}) {
  const sb = getSupabase();
  const { error } = await sb
    .from("topic_comments")
    .update({ is_deleted: true, body: "[deleted]" })
    .eq("id", input.commentId)
    .eq("user_id", input.userId);
  if (error) throw error;
}
