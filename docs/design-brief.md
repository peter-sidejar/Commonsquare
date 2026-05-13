# CommonSquare — Design Brief

**For:** Claude Design
**From:** Peter (Sidejar)
**Status:** Pre-launch. Marketing site + MVP app to be designed in parallel.
**URL:** commonsquare.app

---

## 1. What CommonSquare is

CommonSquare is a competitive debate platform. Think **Chess.com meets debate club**: users face off in structured debates, audiences watch and vote on who made the better case, and an Elo ranking system creates a meritocratic ladder where the best arguers rise — regardless of follower count.

**Positioning line:** "Debate Ideas. Not Political Parties."

The platform has three kinds of users — and all three are valid:
- **Watchers** — read/watch debates, don't participate
- **Voters** — watch and vote on who made the better case
- **Debaters** — step into the arena and compete

It is explicitly **not** a place for partisan red-vs-blue tribal warfare. The whole point is that ideas should be judged on merit, not on who's saying them. Tone is positive, inviting, ideas-first — never anti-establishment, never adversarial.

---

## 2. The two products to design

### A. Marketing site — `commonsquare.app`
Public landing page + supporting pages. Drives waitlist signups before the app opens, and after launch funnels traffic from daily AI-generated topic pages into the product.

### B. The app — post-signup product
A logged-in experience where users take the political compass quiz, claim a username, view their profile, browse debates, vote, and (eventually) compete. MVP is text-only debates; video is V1.5.

---

## 3. Hard constraints (what NOT to do)

These are non-negotiable. Everything else is open to your creative direction.

- **No red/blue partisan color coding anywhere.** Not for the brand, not for the compass, not for archetypes, not for left/right news framing. CommonSquare must feel non-partisan.
- **No party logos, no politician imagery, no flags.**
- **No adversarial / anti-establishment / "us vs them" framing.** Copy and visuals should feel like an invitation to participate, not a rallying cry.
- **No AI-cliché design patterns** (aurora blobs, glass-morphism for the sake of it, circular gauges, etc.).
- **No placeholder images.** Use real-feeling content from the spec (real archetype names, real debate topics, real example users).
- **The political compass is the user's data, not entertainment.** Treat it with credibility — it should feel science-informed, not a buzzfeed quiz.
- **Privacy matters.** Quiz answers are always private; only the archetype label/badge is optionally shareable.

---

## 4. Marketing site

Full landing-page copy is already written and locked: see `docs/landing-page-copy.md`.

### Sections, in order:
1. **Nav** — logo "CommonSquare" + "Join the Waitlist" CTA
2. **Hero** — badge ("The arena for ideas is opening"), H1 "Debate Ideas. Not Political Parties.", subline, CTA "Claim Your Spot", supporting "Free to join. Watch, vote, or debate — your call."
3. **Why CommonSquare** — three feature cards: *Ideas Over Identity* · *Watch, Vote, or Debate* · *The Best Ideas Rise*
4. **Insight bridge** — a pull-quote section that softens the transition into How It Works
5. **How It Works** — 3 steps: *Create Your Profile (30 sec)* → *Discover Your Compass (2 min)* → *Enter the Arena (Coming soon)*
6. **Compass preview** — visual preview of the 2-axis compass with an example archetype (e.g. Civil Libertarian)
7. **Debate preview** — example debate card showing topic, status, both debaters with their handles + Elo + archetype, round indicator, viewer count
8. **Final CTA** — "The best debates haven't happened yet." + Claim Your Spot button
9. **Footer** — logo, tagline, Privacy · Terms · Twitter/X · Contact

### Supporting marketing pages (post-launch):
- **`/topics/[slug]`** — daily AI-generated topic landing pages. Each page shows: debate question, neutral background, **how the LEFT covers it** vs **how the RIGHT covers it** (side-by-side on desktop, stacked on mobile), source cards with bias badges, a yes/no vote (requires account), related topics. These pages need to be SEO-optimized and shareable. See `docs/growth-engine-spec.md` for the full system. Important: the LEFT/RIGHT framing is the differentiator — design the contrast clearly **without** using red and blue.
- **`/topics`** — index of all daily topic pages, browsable with search + tag filters

---

## 5. The app — user flows

### Flow 1: Onboarding (the "Claim Your Spot" funnel)
This is the only flow that exists at waitlist stage. Everything below the quiz is for the launched product.

1. **Signup** — email + Google OAuth
2. **Username claim** — pick a unique handle. The pitch is "lock it in before someone else does." Already scaffolded in `src/components/username-claim.tsx`.
3. **Political compass quiz** — 30 questions, ~2 minutes. See full spec in `docs/political-compass-spec.md`. Already scaffolded in `src/app/quiz/`.
4. **Results page** — show the user their compass position, their archetype (badge + name + description), and a 3-axis breakdown. Already scaffolded in `src/app/results/`.
5. **Profile / "Lounge"** — the user's home base inside the app. Already scaffolded in `src/app/lounge/`.

### Flow 2: Browse + watch + vote (post-launch)
1. User logs in → lands on a feed of active/recent debates
2. Clicks a debate → public debate viewer page
3. Reads both sides' rounds → votes on who made the better case
4. Sees results after voting (vote counts hidden until vote cast — prevents bandwagon)

### Flow 3: Enter the arena (post-launch)
1. User joins matchmaking queue
2. Matched within ±200 Elo to an opponent
3. Receives a system-assigned debate topic
4. Submits round 1 (opening, 800 chars) within 24h
5. Opponent submits round 1
6. Submits round 2 (rebuttal, 500 chars), round 3 (closing, 400 chars)
7. Voting window opens for 48 hours
8. Elo updates → debate appears on profile

### Flow 4: Leaderboard
Global top 50, weekly top risers, category leaderboards (5 categories: politics, economics, technology, culture, philosophy).

---

## 6. The political compass — design-critical details

This is the centerpiece of the onboarding experience. It needs to feel credible.

### Three axes (use these exact labels and language)

| Axis | Low end (0) | High end (100) |
|---|---|---|
| **Economic** | Community Investment | Free Market |
| **Social** | Traditional Values | Progressive Values |
| **Governance** | Institutional Trust | Individual Liberty |

Scores are always **0–100 percentages**. No negative numbers. 50 = balanced.

### Visualization
- **Primary view:** classic 2D compass with Economic on x-axis (Community Investment ← → Free Market) and Social on y-axis (Traditional Values ↕ Progressive Values). User shown as a dot on the grid.
- **Governance** is the third dimension — show it as a separate bar or secondary visualization. Don't try to cram it into the 2D compass.
- The compass-preview section on the landing page uses **Traditionalist (top) / Progressive (bottom) / Government (left) / Free Market (right)** — match these axis labels.

### The 8 archetypes
Each user is assigned one of these based on which side of 50 they land on for each axis. Each has a name, color, one-liner, and a longer description. Full text in `docs/political-compass-spec.md`. The MVP tech plan and landing copy reference these archetype names — they're locked.

| # | Archetype | Suggested color (you can override) |
|---|---|---|
| 1 | Traditional Democrat | Deep Teal `#0D7377` |
| 2 | Progressive | Indigo `#4F46E5` |
| 3 | Working Populist | Burnt Orange `#C2410C` |
| 4 | Progressive Populist | Emerald `#059669` |
| 5 | Establishment Conservative | Slate Blue `#475569` |
| 6 | Modern Moderate | Violet `#7C3AED` |
| 7 | Constitutional Conservative | Amber `#D97706` |
| 8 | Classical Liberal | Coral `#E11D48` |

These colors are deliberately not red/blue. Open to you to redesign the palette as long as it stays non-partisan.

Each archetype needs a **badge** — a distinct visual mark a user proudly displays on their profile. Should feel collectible, like a flair or a chess title, not a generic "Personality Type" sticker.

### Quiz UX
- **5-point Likert scale** for every question: Strongly Disagree → Disagree → Neutral → Agree → Strongly Agree
- 30 questions total, randomized order across the three axes
- Progress indicator — already scaffolded in `src/components/quiz-progress.tsx`
- ~4 seconds per question is the target → keep the UI fast, no friction

---

## 7. Debate viewer — design-critical details

Even though debates are text-only in MVP, this screen is the product's content surface. It's what gets shared on social, ranked in search, and clipped for short-form video later.

### What it shows:
- **Topic** (the debate question) — large, prominent
- **Both debaters** side-by-side: avatar, @handle, Elo, archetype badge, W/L record
- **Round-by-round display** — Opening (debater A then B), Rebuttal (A then B), Closing (A then B). 6 text blocks total.
- **Round indicator** — "Round 2 of 4 · Rebuttals" pattern
- **Live status** — pending / in progress / voting open / complete
- **Vote action** — binary "A wins" / "B wins" button, available only after voting opens. One vote per user. Must be logged in. Vote results hidden until you vote.
- **After voting** — show split (e.g. 62% / 38%) + total vote count. Optional: breakdown by archetype.
- **Shareable** — clean OG image, clean URL, anyone can read without an account

### Example debate card (from landing page)
- Topic: Should the federal minimum wage be increased?
- Status: Live
- Debater A: @MarcusK — Elo 1,347 · Policy Pragmatist
- Debater B: @SarahR — Elo 1,412 · Free Market Defender
- Round 2 of 4 · Rebuttals
- 2,847 watching

(Note: "Policy Pragmatist" and "Free Market Defender" in the landing copy are example/preview archetype names — the locked archetype set is the 8 in section 6. Use the locked names in shipping designs.)

---

## 8. Profile / "Lounge" — design-critical details

Each user has a public-ish profile that shows:
- Avatar, display name, @handle
- **Archetype badge + name** (only if user has opted to make it public — off by default)
- **Compass dot position** (only if public)
- **3-axis breakdown** as percentage bars (only if public)
- Elo rating (starts at 1200)
- W/L record
- Recent debates
- Rank / leaderboard position
- "Challenge" CTA — generates a shareable link that pre-fills a debate challenge with this user

The privacy toggle is important: someone might love being a "Modern Moderate" publicly but never want strangers to see they strongly disagreed with question S8. Quiz answers themselves are never shown to anyone, ever.

---

## 9. The daily topic page (growth engine)

Every day, an automated workflow picks the most debatable political news story and publishes a topic page at `commonsquare.app/topics/[slug]`. This is the main SEO + social traffic engine. Full architecture in `docs/growth-engine-spec.md`.

### Page sections (in order):
1. **Header** — topic title, date, tag badges, "Today's Topic" badge if current
2. **The debate question** — large, bold ("Should the U.S. have launched airstrikes on Iran-backed targets?")
3. **Vote buttons** — Yes / No. Account required. Modal triggers signup if not logged in.
4. **Background context** — neutral 3-4 paragraph summary of what happened
5. **How each side sees it** — two columns:
   - **Left-leaning coverage** — AI summary of left framing + source cards (outlet, bias badge, headline, link, excerpt)
   - **Right-leaning coverage** — same structure for right sources
6. **Join the debate** — CTA to sign up / claim spot
7. **Related topics** — links to other topic pages with similar tags

### Design challenge for these pages:
Communicating "this is how the LEFT covers it" vs "this is how the RIGHT covers it" without using red and blue. The contrast needs to be visually clear and credible but not tribal. This is the most original design problem in the project.

---

## 10. Current code state (what's already scaffolded)

The repo at `/Users/petergratale/Development/Commonsquare` is a Next.js 15 + Tailwind project. Existing scaffolding (functional, not designed):

- `src/app/page.tsx` — landing page shell
- `src/app/quiz/` — quiz flow
- `src/app/results/` — results page
- `src/app/lounge/` — profile/dashboard
- `src/components/landing/` — landing page sections
- `src/components/marketing/` — marketing components
- `src/components/compass-graph.tsx` — compass visualization
- `src/components/archetype-card.tsx` — archetype display
- `src/components/likert-scale.tsx` — quiz response control
- `src/components/question-card.tsx` — quiz question display
- `src/components/quiz-progress.tsx` — quiz progress indicator
- `src/components/username-claim.tsx` — username picker
- `src/components/waitlist-form.tsx` — waitlist signup
- `src/components/ui/` — base UI primitives
- `UIJAR.md` — UIjar 2.5 component library is wired up; component registry available

You can redesign any of these. The scaffolding is a starting point, not a constraint.

---

## 11. Reference documents (in this repo)

- `docs/landing-page-copy.md` — locked copy for the marketing site
- `docs/political-compass-spec.md` — full quiz spec including all 30 questions, scoring math, archetype descriptions
- `docs/growth-engine-spec.md` — daily topic page system, full architecture (the "how the left/right covers it" pages)

Additional context in iCloud (`~/Library/Mobile Documents/com~apple~CloudDocs/Claude/Commonsquare/`):
- `CommonSquare_MVP_Tech_Plan.docx` — full MVP scope, tech stack, timeline, GTM plan
- `landing-page-mockup.html` — early HTML mockup of the landing page (reference only — feel free to depart from it entirely)

---

## 12. What we need from you

Designs for:
1. **Marketing landing page** (`/`) — desktop + mobile
2. **Daily topic page template** (`/topics/[slug]`) — the left/right coverage design is the priority
3. **Onboarding flow** — signup → username claim → quiz question screen → quiz progress → results
4. **Results / archetype reveal** — the moment the user sees their compass position and archetype
5. **Profile / Lounge** — public and own-view variants
6. **Debate viewer** — desktop + mobile
7. **Leaderboard**
8. **Matchmaking queue / waiting state**
9. **Archetype badge system** — 8 badges, consistent style, distinct identities
10. **Brand foundation** — logo, type system, color palette (non-partisan), iconography

You have full creative latitude on visual direction. The only constraints are the ones in section 3.
