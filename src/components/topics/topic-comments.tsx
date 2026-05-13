"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { CSProcAvatar } from "@/components/cs/cs-proc-avatar";
import {
  fetchComments,
  fetchMyCommentVotes,
  postComment,
  softDeleteComment,
  voteComment,
  type CommentSort,
} from "@/lib/comments";
import { fetchMyProfile } from "@/lib/profile";
import { useSession } from "@/lib/use-session";
import { CSArchetypes, type ArchetypeId } from "@/lib/archetypes";
import type { CommentWithAuthor } from "@/lib/database.types";

const MAX_VISIBLE_DEPTH = 3;
const COMMENT_BODY_MAX = 2000;

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

interface TreeNode {
  comment: CommentWithAuthor;
  children: TreeNode[];
}

function buildTree(flat: CommentWithAuthor[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  flat.forEach((c) => byId.set(c.id, { comment: c, children: [] }));
  const roots: TreeNode[] = [];
  flat.forEach((c) => {
    const node = byId.get(c.id)!;
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

interface CommentItemProps {
  node: TreeNode;
  depth: number;
  myUserId: string | null;
  myArchetype: ArchetypeId | null;
  myVotes: Map<string, 1 | -1>;
  onVote: (commentId: string, value: 1 | -1 | 0) => void;
  onReply: (parentId: string, body: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onUnauthAction: () => void;
}

function CommentItem({
  node,
  depth,
  myUserId,
  myArchetype,
  myVotes,
  onVote,
  onReply,
  onDelete,
  onUnauthAction,
}: CommentItemProps) {
  const c = node.comment;
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replying, setReplying] = useState(false);
  const archetype = useMemo(
    () => CSArchetypes.find((a) => a.id === c.archetype_id),
    [c.archetype_id],
  );
  const myVote = myVotes.get(c.id) ?? 0;
  // Delete UX deferred: the comment-list RPC intentionally doesn't return
  // user_id (privacy), so we can't tell which comment is "mine" from this
  // payload alone. A future "My comments" pane on the profile will own
  // moderation of your own posts.

  function toggleVote(target: 1 | -1) {
    if (!myUserId || !myArchetype) {
      onUnauthAction();
      return;
    }
    if (c.is_deleted) return;
    onVote(c.id, myVote === target ? 0 : target);
  }

  async function submitReply() {
    if (!myUserId || !myArchetype) {
      onUnauthAction();
      return;
    }
    const trimmed = replyBody.trim();
    if (!trimmed) return;
    setReplying(true);
    try {
      await onReply(c.id, trimmed);
      setReplyBody("");
      setReplyOpen(false);
    } finally {
      setReplying(false);
    }
  }

  const indent = Math.min(depth, MAX_VISIBLE_DEPTH);
  const leftPad = indent * 18;

  return (
    <div
      style={{
        paddingLeft: leftPad,
        position: "relative",
      }}
    >
      {indent > 0 ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: leftPad - 12,
            top: 0,
            bottom: 0,
            width: 1,
            background: CS.rule,
          }}
        />
      ) : null}
      <div
        className="flex items-start gap-3 px-4 py-4"
        style={{
          borderBottom: `1px solid ${CS.rule}`,
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => toggleVote(1)}
            aria-label="Upvote"
            disabled={c.is_deleted}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: myVote === 1 ? CS.violetT : "transparent",
              border: "none",
              color: myVote === 1 ? CS.violet : CS.mute,
              cursor: c.is_deleted ? "not-allowed" : "pointer",
              fontSize: 14,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ▲
          </button>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color:
                myVote === 1
                  ? CS.violet
                  : myVote === -1
                    ? CS.ink
                    : CS.mute,
              fontWeight: 500,
            }}
          >
            {c.score}
          </span>
          <button
            type="button"
            onClick={() => toggleVote(-1)}
            aria-label="Downvote"
            disabled={c.is_deleted}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background:
                myVote === -1 ? "rgba(26,24,20,0.08)" : "transparent",
              border: "none",
              color: myVote === -1 ? CS.ink : CS.mute,
              cursor: c.is_deleted ? "not-allowed" : "pointer",
              fontSize: 14,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ▼
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <CSProcAvatar
              seed={c.handle === "anonymous" ? c.id : c.handle}
              size={20}
              accent={archetype?.tint}
            />
            <span
              className="font-sans"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: CS.ink,
                letterSpacing: "-0.005em",
              }}
            >
              @{c.handle}
            </span>
            {archetype && c.show_on_profile ? (
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: archetype.tint,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {archetype.short}
              </span>
            ) : null}
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: CS.mute,
                letterSpacing: "0.08em",
              }}
            >
              · {relativeTime(c.created_at)}
            </span>
          </div>

          <div
            className="font-sans"
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: c.is_deleted ? CS.mute : CS.ink,
              fontStyle: c.is_deleted ? "normal" : "normal",
              letterSpacing: "-0.005em",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {c.body}
          </div>

          {!c.is_deleted ? (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!myUserId || !myArchetype) {
                    onUnauthAction();
                    return;
                  }
                  setReplyOpen((v) => !v);
                }}
                className="font-mono"
                style={{
                  background: "transparent",
                  border: "none",
                  color: CS.mute,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Reply
              </button>
              {/* Delete UX deferred — see comment above. */}
            </div>
          ) : null}

          {replyOpen ? (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={replyBody}
                onChange={(e) =>
                  setReplyBody(e.target.value.slice(0, COMMENT_BODY_MAX))
                }
                rows={3}
                placeholder={`Reply to @${c.handle}…`}
                className="font-sans"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${CS.rule2}`,
                  background: CS.paper,
                  color: CS.ink,
                  fontSize: 13,
                  lineHeight: 1.55,
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: CS.mute,
                    letterSpacing: "0.08em",
                  }}
                >
                  {replyBody.length}/{COMMENT_BODY_MAX}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyOpen(false);
                      setReplyBody("");
                    }}
                    className="font-mono"
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "transparent",
                      border: `1px solid ${CS.rule2}`,
                      color: CS.ink,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <CSButton
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={submitReply}
                    disabled={replying || !replyBody.trim()}
                  >
                    {replying ? "Posting…" : "Reply"}
                  </CSButton>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {node.children.map((child) => (
        <CommentItem
          key={child.comment.id}
          node={child}
          depth={depth + 1}
          myUserId={myUserId}
          myArchetype={myArchetype}
          myVotes={myVotes}
          onVote={onVote}
          onReply={onReply}
          onDelete={onDelete}
          onUnauthAction={onUnauthAction}
        />
      ))}
    </div>
  );
}

interface Props {
  topicId: string;
  initialComments: CommentWithAuthor[];
  initialSort?: CommentSort;
}

export function TopicComments({
  topicId,
  initialComments,
  initialSort = "top",
}: Props) {
  const router = useRouter();
  const { session, loading: loadingSession } = useSession();
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [sort, setSort] = useState<CommentSort>(initialSort);
  const [refetching, setRefetching] = useState(false);
  const [myVotes, setMyVotes] = useState<Map<string, 1 | -1>>(new Map());
  const [myArchetype, setMyArchetype] = useState<ArchetypeId | null>(null);
  const [composerBody, setComposerBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Fetch user state (profile + own votes).
  useEffect(() => {
    if (!session?.user) {
      setMyVotes(new Map());
      setMyArchetype(null);
      return;
    }
    let cancelled = false;
    fetchMyProfile(session.user.id)
      .then((p) => {
        if (!cancelled && p) setMyArchetype(p.archetype_id as ArchetypeId);
      })
      .catch(console.error);
    fetchMyCommentVotes(
      session.user.id,
      comments.map((c) => c.id),
    )
      .then((m) => {
        if (!cancelled) setMyVotes(m);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [session, comments]);

  // Refetch when sort changes.
  useEffect(() => {
    if (sort === initialSort) return;
    let cancelled = false;
    setRefetching(true);
    fetchComments(topicId, sort)
      .then((rows) => {
        if (!cancelled) setComments(rows);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setRefetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sort, topicId, initialSort]);

  const refresh = useCallback(async () => {
    try {
      const rows = await fetchComments(topicId, sort);
      setComments(rows);
    } catch (err) {
      console.error(err);
    }
  }, [topicId, sort]);

  const handleVote = useCallback(
    async (commentId: string, value: 1 | -1 | 0) => {
      if (!session?.user) {
        setShowSignupPrompt(true);
        return;
      }
      // Optimistic update of myVotes + score on the comment.
      setMyVotes((prev) => {
        const next = new Map(prev);
        if (value === 0) next.delete(commentId);
        else next.set(commentId, value);
        return next;
      });
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const oldVote = myVotes.get(commentId) ?? 0;
          const delta = value - oldVote;
          return { ...c, score: c.score + delta };
        }),
      );
      try {
        await voteComment({
          commentId,
          userId: session.user.id,
          value,
        });
      } catch (err) {
        console.error(err);
        // On error, refresh from server to undo optimistic update.
        await refresh();
      }
    },
    [session, myVotes, refresh],
  );

  const handleReply = useCallback(
    async (parentId: string, body: string) => {
      if (!session?.user || !myArchetype) {
        setShowSignupPrompt(true);
        return;
      }
      await postComment({
        topicId,
        userId: session.user.id,
        archetypeId: myArchetype,
        body,
        parentId,
      });
      await refresh();
    },
    [session, myArchetype, topicId, refresh],
  );

  const handleDelete = useCallback(
    async (commentId: string) => {
      if (!session?.user) return;
      await softDeleteComment({
        commentId,
        userId: session.user.id,
      });
      await refresh();
    },
    [session, refresh],
  );

  async function submitTopLevel() {
    if (!session?.user || !myArchetype) {
      setShowSignupPrompt(true);
      return;
    }
    const trimmed = composerBody.trim();
    if (!trimmed) return;
    setPosting(true);
    try {
      await postComment({
        topicId,
        userId: session.user.id,
        archetypeId: myArchetype,
        body: trimmed,
        parentId: null,
      });
      setComposerBody("");
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  const tree = useMemo(() => buildTree(comments), [comments]);
  const total = comments.filter((c) => !c.is_deleted).length;

  return (
    <section className="mt-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h3
            className="font-sans"
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 28px)",
              letterSpacing: "-0.025em",
              color: CS.ink,
            }}
          >
            Discussion
          </h3>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {total} {total === 1 ? "comment" : "comments"}
          </span>
        </div>
        <div className="flex items-center gap-1" role="tablist">
          {(["top", "new", "controversial"] as CommentSort[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              role="tab"
              aria-selected={sort === s}
              className="font-mono"
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: sort === s ? CS.ink : "transparent",
                color: sort === s ? CS.paper : CS.mute,
                border: `1px solid ${sort === s ? CS.ink : CS.rule2}`,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                opacity: refetching && sort !== s ? 0.5 : 1,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div
        className="mb-8 flex flex-col gap-3 px-5 py-5"
        style={{
          background: CS.paper2,
          border: `1px solid ${CS.rule}`,
          borderRadius: 14,
        }}
      >
        {session?.user ? (
          <>
            <textarea
              value={composerBody}
              onChange={(e) =>
                setComposerBody(e.target.value.slice(0, COMMENT_BODY_MAX))
              }
              rows={3}
              placeholder="Add to the discussion…"
              className="font-sans"
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                border: `1px solid ${CS.rule2}`,
                background: CS.paper,
                color: CS.ink,
                fontSize: 14,
                lineHeight: 1.55,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <div className="flex items-center justify-between">
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: CS.mute,
                  letterSpacing: "0.08em",
                }}
              >
                {composerBody.length}/{COMMENT_BODY_MAX}
              </span>
              <CSButton
                type="button"
                variant="primary"
                size="sm"
                onClick={submitTopLevel}
                disabled={posting || !composerBody.trim()}
              >
                {posting ? "Posting…" : "Comment"}
              </CSButton>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:text-left">
            <p
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: CS.ink,
                flex: 1,
              }}
            >
              {loadingSession
                ? "…"
                : "Sign in to add to the discussion. Reading is open to everyone."}
            </p>
            {!loadingSession ? (
              <CSButton
                variant="primary"
                size="sm"
                onClick={() => router.push("/quiz")}
              >
                Take the Compass →
              </CSButton>
            ) : null}
          </div>
        )}
      </div>

      {tree.length === 0 ? (
        <div
          className="flex flex-col items-start gap-3 px-6 py-10"
          style={{
            border: `1px dashed ${CS.rule2}`,
            borderRadius: 14,
            background: CS.paper,
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
            No comments yet
          </span>
          <p
            className="font-sans"
            style={{
              margin: 0,
              fontSize: 14,
              color: CS.ink,
              letterSpacing: "-0.005em",
            }}
          >
            Be the first to make a point on this one.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: CS.paper,
            border: `1px solid ${CS.rule}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {tree.map((node) => (
            <CommentItem
              key={node.comment.id}
              node={node}
              depth={0}
              myUserId={session?.user?.id ?? null}
              myArchetype={myArchetype}
              myVotes={myVotes}
              onVote={handleVote}
              onReply={handleReply}
              onDelete={handleDelete}
              onUnauthAction={() => setShowSignupPrompt(true)}
            />
          ))}
        </div>
      )}

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
            <CSBadge dot>Discussion is for members</CSBadge>
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
              Reading is open to everyone. Posting, voting, and replying
              require an account — keeps the discussion real and lets us
              show how each archetype is engaging with this topic.
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
    </section>
  );
}
