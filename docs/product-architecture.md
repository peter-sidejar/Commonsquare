# CommonSquare — Product Architecture

**Last updated:** 2026-05-13
**Status:** Living doc. Update whenever a core mechanic changes.

This is the source of truth for **how the product works**. It captures decisions made across the design handoff, build sessions, and conversations to date. If something here contradicts older docs, this wins.

---

## 1. The two surfaces

CommonSquare has two distinct content surfaces that interrelate. Understanding the difference is critical.

### Topics — the discussion surface

A **topic** is a *place* about a subject. Permanent. Read by anyone. The SEO and traffic anchor.

**Contains:**
- AI-generated neutral background
- Left-leaning and right-leaning coverage summaries
- Source articles with bias labels (Left / Lean Left / Center / Lean Right / Right)
- A single binary debate question (the "Yes/No" of the topic)
- A vote tally with archetype breakdown
- A threaded comment section *(to build)*
- A list of debates that have been tied to this topic *(to build, post-debate-engine)*

**Created by:**
- Daily automated AI workflow via n8n *(to build)*
- Admin manual entry via `/admin/topics/new` *(built)*

**Lives at:** `/topics/[slug]` (built), index at `/topics` (built).

### Debates — the competitive surface

A **debate** is a *match* between two specific people. Bounded. Has rounds, deadlines, and an archive.

**Contains:**
- Two debaters, identified by handle + archetype
- Three rounds per debater (Opening / Rebuttal / Closing) — 6 text blocks total
- Round-by-round transcript
- Optional link to a topic
- Optional custom prompt (if no topic)
- Visibility setting (open / closed)
- Audience comments *(open debates only, to build)*

**Created by:**
- A user issuing a challenge *(to build)*

**Lives at:** `/debates/[id]` *(to build)*.

### The relationship

A debate can be **about a topic** (link the topic ID) — in which case it appears on the topic's page in the "Debates on this topic" section.

A debate can also be **standalone** — a custom prompt the user writes. These exist purely in the debate feed, not tied to any topic.

A topic doesn't need any debates. Most topics will have lots of voters and commenters but few or zero formal debates.

---

## 2. Debate types

Two independent choices when issuing a challenge, plus a locked cadence:

|  | **Specific opponent** | **Open to anyone** |
|---|---|---|
| **Open** (audience watches) | Public duel — challenge someone by handle, audience watches | Matchmaking queue — anyone in queue can claim |
| **Closed** (no audience) | Private duel — challenge a specific person, just the two of you | Private queue — match with someone, just the two of you |

**Cadence: 12-hour round deadline, locked.** No picker in v1. We add other cadences (10m / 30m / 1h / 24h) when we have enough volume to fragment the matching pool without empty buckets.

### UX for issuing a challenge

```
What topic?         [link to existing topic | propose custom prompt]
What's your stance? [Yes | No]
Who?                ● Anyone           
                    ○ Challenge @____  
Audience?           ● Yes, open       
                    ○ No, private
                                    [Find debate →]
```

Default = "Anyone, public" — most engagement, fastest match.

### Specific vs Anyone

- **Specific**: appears only in the named user's "Incoming Challenges" inbox. Never in the public feed. They can accept or decline.
- **Anyone**: appears in the public "Open Challenges Waiting" feed. First qualified user to accept claims it.

### Open vs Closed

- **Open**: lives in the public feed during and after. Audience can watch live, comment, and (later) vote. Open is the default — more rewarding, more engagement, more XP.
- **Closed**: never appears in the public feed. Lives only in the two parties' "My Debates" lists. No audience, no comments.

### Cross-spectrum matching

When opponent = **Anyone** and the debate is tied to a topic, the matchmaker prefers an opponent whose archetype is opposite on the **topic's primary axis** (`e`, `s`, or `g`). Each topic has a `primary_axis` field set at creation time.

- Topic on minimum wage → primary_axis `e` → prefer pairing across the Economic axis
- Topic on gender identity → primary_axis `s` → prefer pairing across the Social axis
- Topic on the federal government's role → primary_axis `g` → prefer pairing across the Governance axis

When opponent = Anyone on a **standalone** debate (no topic), default to maximum spectrum distance across all three axes — the most "everything-disagrees" pairing available.

This is the platform's structural differentiator: debates are guaranteed to be debates, not two people agreeing.

---

## 3. Judging — what determines a winner

**v1: no judging. No winner determination at all.**

Both debaters get XP for completing rounds, regardless of outcome. The platform is about the *act of debating*, not the verdict. This radically reduces scope (no audience voting infrastructure, no AI judging, no Elo, no appeal mechanics) and dodges the entire "who decides who won" problem until we have signal on which mechanism users actually want.

### When judging comes back (v2+)

| Mode | Judged by | Stakes |
|---|---|---|
| Closed (private) | AI judge (Claude, structured-output) | XP only, possibly reduced Elo when Elo returns |
| Open (audience) | Audience vote with cross-spectrum weighting + min-vote threshold | Full XP + Elo when Elo returns |
| Featured / live | Audience + judge panel + AI as one judge | Full XP + Elo + visibility |

### AI judge design (for when we ship it)

- Run after both debaters complete their 3 rounds
- Full transcript + topic + primary axis go to Claude with a structured-output prompt
- Returns: `{ winner: "a" | "b", confidence: 0..1, reasoning: "..." }`
- Stored in `debate_judgments` table
- Reasoning always shown to both debaters
- Either party can request review (re-judge with another model, then escalate to community vote)
- Pin model version + temperature 0 for reproducibility
- Sanitize round content before passing to judge (prompt-injection guard)
- Cost ~$0.02/debate at Claude Sonnet pricing

### AI as transparency layer (later, on open debates)

For public-ranked debates (when Elo + audience voting return), show an AI second opinion next to the audience verdict:

> **Audience:** 64% A · 36% B
> **AI second opinion (Claude):** 71% B · 29% A · [view reasoning]

When those disagree noticeably, the platform is honest about it. Doesn't affect Elo — pure transparency. This is a defensive moat against "you're just running a popularity contest."

---

## 4. XP — the single rating

v1 uses **XP only**. No Elo. One rating. Goes up. Never decays. Easier to ship, easier to explain, removes the "judging" problem from the critical path entirely.

### Earning rates (initial — tune based on data)

| Action | XP |
|---|---|
| Complete a debate (any outcome) | +10 |
| Win a debate *(when judging exists)* | +25 additional |
| Upset win *(when judging + Elo exist)* | +50 additional |
| Vote on a topic | +1 |
| Comment on a topic | +1 (cap per topic to prevent farming) |
| First debate of the day | +5 |
| Daily activity streak | +5/day, scales with length |
| First-time bonuses (first debate, first cross-spectrum debate, first archetype-vs-archetype matchup) | +50 each |
| Civility flag *(when moderation comes back)* | +10 |
| Forfeit | 0 |

### Tiers (deferred to v1.5)

The architecture supports XP-gated tiers, but **v1 has a single tier**: everyone can do everything. Tier-gating activates when we have volume to make the gating meaningful (otherwise new users get stuck unable to find an opponent in the same tier).

Planned tier structure for when we turn it on:

| Tier | XP threshold | Unlocks |
|---|---|---|
| Initiate | 0 | Practice + private debates |
| Debater | 100 | Public ranked matchmaking |
| Champion | 500 | Tournament eligibility, verified badge |
| Featured | 2000 *or* tournament win | Live-streamed featured debates |

---

## 5. Safety mechanics

Even with judging deferred, harassment and abuse vectors exist. v1 ships with:

- **Right of refusal**: any incoming challenge can be declined with zero penalty. No "you ducked them" public mark.
- **Block / mute**: standard. Blocked users can't challenge you or see your profile. Mute is softer.
- **Rate limits on specific challenges**: a user who isn't following the recipient AND isn't of a similar XP tier can send at most N specific challenges per day (start with N = 5).
- **Handle profanity filter**: Postgres CHECK constraint + client-side mirror, blocks slurs, sexual terms, and reserved/impersonation handles. *(built)*
- **Topic comments + debate audience comments**: profanity filter on submission, audience can report, soft-hide at N reports.
- **Specific challenges never appear in the public feed.** Only in the recipient's inbox.

---

## 6. The feed (Reddit-style)

The lounge / home view shows a **mixed feed of topic cards and debate cards**.

### Tabs

| Tab | Shows |
|---|---|
| **For You** | Personalized by archetype — topics on your strong axes, debates from people in your archetype, etc. |
| **Live Now** | Open debates currently mid-round |
| **Today's Topic** | Pinned daily topic card |
| **Open Debates** | "Anyone, open" debates waiting for an opponent (joinable) + in-progress open debates (watchable) |
| **Tournaments** | Bracket events *(future)* |

### Personal inboxes (separate from the feed)

| Tab | Shows |
|---|---|
| **My Debates** | All your debates, open and closed |
| **Incoming Challenges** | Specific challenges directed at you (accept / decline) |
| **Outgoing Challenges** | Specific challenges you've sent (awaiting response) |

---

## 7. Data model (current + planned)

### Built

```
profiles
  user_id PK → auth.users
  handle (unique, case-insensitive, profanity-checked)
  email, axis_e, axis_s, axis_g, archetype_id
  show_on_profile, elo (default 1200, not active yet), wins, losses
  created_at, updated_at

topics
  id PK, slug (unique), title, debate_question
  background, left_summary, right_summary
  left_sources / right_sources / center_sources (jsonb)
  tags, primary_axis ('e' | 's' | 'g' | 'none')
  og_image_url, status, published_at, created_at, updated_at

topic_votes
  id PK, topic_id FK, user_id FK
  vote ('yes' | 'no'), archetype_id (snapshot)
  unique(topic_id, user_id)
```

### Near-term build queue

```
topic_comments
  id PK, topic_id FK, user_id FK, parent_id FK (nullable, for threading)
  body, archetype_id (snapshot)
  created_at, updated_at
  
comment_votes (upvote/downvote on comments)
  comment_id FK, user_id FK, value (+1 | -1)
  unique(comment_id, user_id)
```

### Future build (debate engine)

```
debates
  id PK
  topic_id FK (nullable — null for standalone debates)
  custom_prompt (nullable — present when topic_id is null)
  debater_a_user_id FK, debater_b_user_id FK
  debater_a_stance ('yes' | 'no')
  debater_b_stance ('yes' | 'no')  -- always opposite of a
  visibility ('open' | 'closed')
  opponent_selection ('specific' | 'anyone')
  status ('queued' | 'active' | 'voting' | 'complete' | 'forfeit')
  current_round (1..3)
  winner_id FK (nullable, only set in v2+ when judging exists)
  created_at, updated_at, completed_at

rounds
  id PK, debate_id FK, round_number (1..3)
  user_id FK (which debater wrote this round)
  content, submitted_at, deadline_at
  unique(debate_id, round_number, user_id)

debate_comments (v2 — audience commentary on open debates)
  id PK, debate_id FK, user_id FK, parent_id FK (nullable)
  body, archetype_id (snapshot), created_at

debate_judgments (v2 — AI judge or audience verdict)
  id PK, debate_id FK
  judge_type ('ai' | 'audience' | 'panel')
  winner_id FK, confidence numeric
  reasoning text (for AI judge)
  vote_counts jsonb (for audience)
  created_at

xp_events (v1 — append-only ledger of XP grants)
  id PK, user_id FK
  action text ('debate_complete', 'vote_cast', 'comment_post', 'streak_day', ...)
  amount int
  reference_id uuid (debate_id, topic_id, etc.)
  reference_type text
  created_at

-- Total XP derived by sum over user_id from xp_events.
-- profiles.xp could be a materialized column updated by trigger.
```

---

## 8. Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind |
| Auth + DB | Supabase (Postgres + Auth + RLS) |
| Hosting | Vercel |
| Daily topic automation | n8n (Sidejar instance) + Anthropic API |
| AI judging *(future)* | Anthropic API (Claude Sonnet, structured output) |
| Social distribution *(future)* | n8n → X / IG / LinkedIn |
| OG images *(future)* | Vercel OG (`@vercel/og`) |
| Email *(future)* | Resend or Brevo |

---

## 9. Current build state

**Shipped (v0.1 — waitlist + topic surface):**
- ✅ Marketing landing page (V2 Civic Minimal design handoff)
- ✅ Compass quiz (22 questions, research-backed: Pew + MFQ + WVS + ANES)
- ✅ Archetype scoring + 8 locked archetypes
- ✅ Magic-link auth via Supabase
- ✅ Username claim with handle profanity filter (DB CHECK + client mirror)
- ✅ Results page + profile lock-in + lounge
- ✅ Topic surface: `/topics/[slug]`, `/topics`, `/admin/topics/new`, `/api/topics`
- ✅ Topic Yes/No voting with archetype breakdown
- ✅ Today's Topic tile on the lounge
- ✅ Today's Topic preview section on the landing
- ✅ Production domain (`commonsquare.app`) live on Vercel

**Build queue (rough priority):**
1. **Topic comments** — threaded discussion under each topic. Highest engagement-multiplier per hour of build.
2. **n8n daily topic flow** — Anthropic API + NewsData.io → POST to `/api/topics`. Workflow JSON delivered, Peter wires in his Sidejar n8n instance.
3. **XP ledger + event tracking** — append-only `xp_events` table, helper functions, "Total XP" tile on lounge.
4. **Debate engine v1** — schema, challenge flow, matchmaking (anyone + specific), round submission with 12h deadlines, debate viewer page, "no judging yet" status.
5. **Lounge feed** — turn the lounge into the Reddit-style mixed feed (tabs: For You / Live Now / Today's Topic / Open Debates).
6. **OG image template + social distribution** — Vercel OG for shareable cards, n8n posts daily topic to socials.
7. **Tiers + audience voting + AI judging** — v1.5 once we have user data.

---

## 10. Decision log

Decisions captured here so we don't relitigate them.

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | V2 Civic Minimal as the landing direction | Selected from 5 design handoff options |
| 2026-05-13 | Drop Elo from v1, use XP only | Eliminates the "who decides who won" problem from the critical path; ship faster |
| 2026-05-13 | No practice mode | Adds tier complexity without obvious user value; everything counts |
| 2026-05-13 | Default cadence 12h, no picker | Pool fragmentation at low scale; YAGNI for the others |
| 2026-05-13 | No tier-gating in v1 | Same — fragmentation; single tier until volume justifies |
| 2026-05-13 | Topics ≠ debates (formally distinct entities) | Different lifecycle, different UX, different surface |
| 2026-05-13 | Cross-spectrum matching on topic's primary_axis | The actual product differentiator vs Reddit/X — debates are guaranteed to be debates |
| 2026-05-13 | Right of refusal on all challenges, no penalty | Harassment vector mitigation |
| 2026-05-13 | Specific challenges never appear in the public feed | Same |
| 2026-05-13 | Direct-to-main git workflow during MVP | Speed; reverts to PR flow once real users are onboard |
| 2026-05-13 | Quiz items adapted from Pew 2021 + MFQ + WVS + ANES | Defensibility vs ad-hoc items |
| 2026-05-13 | 22 questions, 8/7/7 across Economic/Social/Governance | Coverage + Stressed-Sideliner discriminators |
