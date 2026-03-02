# CommonSquare Political Compass — Full Spec

## Why This Matters

The quiz is the first real interaction a user has with CommonSquare. It needs to feel credible, insightful, and fair. If someone takes it and thinks "that's not me" — we've lost them. If they take it and think "wow, that's actually pretty accurate" — they'll share it, claim their profile, and tell friends.

This spec is designed to be science-informed (not science-cosplay) and practically useful for the platform's debate matching and community features.

---

## Research Foundation

This system draws from several established frameworks, taking what works and leaving what doesn't:

**What we're building on:**
- The Political Compass (2-axis economic + social model) — simple and well-known, but criticized for oversimplification and biased question framing
- Pew Research Political Typology (2021) — gold standard for typology, uses 27 items and cluster analysis to produce 9 groups. Rigorous but overly US-partisan (groups are defined relative to Democrat/Republican coalitions)
- 8values / 9axes — more dimensions = more accuracy, but too complex for casual users (70+ questions)
- Moral Foundations Theory (Haidt) — the psychological research behind WHY liberals and conservatives think differently. Identifies 6 moral foundations that predict political orientation
- Likert scale best practices — balanced keying, neutral phrasing, no double-barreled questions, avoid social desirability bias

**What we're doing differently:**
- 3 axes instead of 2 (more accurate) or 8+ (too complex)
- Archetype labels that are positive and non-partisan — no group should feel like the "bad" one
- 30 questions (10 per axis) — completable in 2 minutes at ~4 seconds per question
- Percentage-based scoring (0-100 per axis) — no confusing negative numbers
- Privacy-first: answers are never public, only the archetype badge is optionally shareable

---

## The Three Axes

### Axis 1: Economic — Community Investment ↔ Free Market

Measures beliefs about the role of government in the economy.

| Direction | Score 0-49 | Score 50 = Center | Score 51-100 |
|-----------|-----------|-------------------|-------------|
| Label | Community Investment | Balanced | Free Market |
| Believes | Government should actively invest in public goods, regulate markets, and reduce inequality through policy | — | Markets work best with minimal interference; competition and private enterprise drive prosperity |

**Why this axis:** Present in literally every political framework. It's the single most predictive dimension of political orientation. Well-understood by the general public.

**Question topics:** Taxation, healthcare funding, minimum wage, business regulation, trade policy, public education funding, housing policy, wealth inequality, social safety nets, government spending.

---

### Axis 2: Social — Traditional Values ↔ Progressive Values

Measures beliefs about culture, identity, and social norms.

| Direction | Score 0-49 | Score 50 = Center | Score 51-100 |
|-----------|-----------|-------------------|-------------|
| Label | Traditional Values | Balanced | Progressive Values |
| Believes | Society benefits from preserving established institutions, cultural norms, and moral frameworks | — | Society should evolve — expanding rights, challenging norms, and embracing change |

**Why this axis:** Captures the culture-war dimension that the Economic axis misses. Someone can be economically left but socially conservative (common in religious working-class communities) or economically right but socially liberal (libertarian-leaning tech workers). This axis reveals that.

**Question topics:** Immigration, criminal justice reform, drug policy, religious role in public life, gender and identity, free speech boundaries, gun rights, environmental regulation, military/patriotism, family structure.

---

### Axis 3: Governance — Institutional Trust ↔ Individual Liberty

Measures beliefs about power, authority, and how decisions should be made.

| Direction | Score 0-49 | Score 50 = Center | Score 51-100 |
|-----------|-----------|-------------------|-------------|
| Label | Institutional Trust | Balanced | Individual Liberty |
| Believes | Strong institutions (government, courts, experts, international bodies) are essential for a well-functioning society | — | Individuals and local communities should have maximum autonomy; centralized power tends to overreach |

**Why this axis (and why it matters for CommonSquare):** This is the dimension most quizzes miss — and it's arguably the most important one in 2024+ politics. It captures the populist vs. establishment divide that cuts across traditional left-right lines. A left-wing populist (distrusts corporate institutions) and a right-wing populist (distrusts government institutions) may have more in common with each other than with their own party's establishment wing. This axis is what makes CommonSquare debates interesting — it creates unexpected alliances.

**Grounded in:** Haidt's Authority/Liberty moral foundation, the Federal/Unitary axis from 9axes, and the Pew typology's finding that "Stressed Sideliners" and "Outsider Left" share institutional distrust despite having different policy views.

**Question topics:** Trust in federal government, media credibility, expert authority (science, medicine), surveillance/privacy, local vs. federal decision-making, corporate power, judicial system, electoral system, international institutions, personal data rights.

---

## Scoring Methodology

### Response Scale

Each question is a statement. Users respond on a **5-point Likert scale:**

1. **Strongly Disagree**
2. **Disagree**
3. **Neutral**
4. **Agree**
5. **Strongly Agree**

### Scoring Per Question

Each question maps to exactly one axis and has a **direction** (positive or negative):

- **Positive-keyed question:** Agreement pushes the score toward the HIGH end of the axis (Free Market, Progressive, Individual Liberty)
- **Negative-keyed question:** Agreement pushes the score toward the LOW end of the axis (Community Investment, Traditional, Institutional Trust)

Score mapping for positive-keyed questions:
| Response | Points |
|----------|--------|
| Strongly Disagree | 0 |
| Disagree | 1 |
| Neutral | 2 |
| Agree | 3 |
| Strongly Agree | 4 |

Score mapping for negative-keyed questions (reversed):
| Response | Points |
|----------|--------|
| Strongly Disagree | 4 |
| Disagree | 3 |
| Neutral | 2 |
| Agree | 1 |
| Strongly Agree | 0 |

### Balanced Keying

Each axis has **5 positive-keyed and 5 negative-keyed questions** (10 total per axis). This is critical — it counteracts acquiescence bias (the tendency to agree with any statement). If all questions were positive-keyed, someone who just clicks "Agree" on everything would score high on every axis, which is meaningless.

### Final Score Calculation

Per axis:
- Raw score = sum of all 10 question scores (range: 0 to 40)
- **Percentage score = (raw score / 40) × 100** (range: 0 to 100)
- Score of 50 = perfectly centered on that axis

This means the user sees three clean percentages, like:
- Economic: 34% (leans Community Investment)
- Social: 71% (leans Progressive)
- Governance: 55% (slightly Individual Liberty)

**No negative numbers. No confusing scales. Just percentages.**

### Display

The compass visualization plots two axes at a time:
- **Primary view:** Economic (x-axis) vs. Social (y-axis) — the classic compass
- **Secondary view:** Governance axis shown as a separate bar or third dimension

The user's dot is placed on the 2D grid based on their Economic and Social scores, with the Governance score displayed alongside. The archetype label is the primary takeaway.

---

## The Eight Archetypes

Based on the three axes, users fall into one of **8 archetype zones**. Each archetype is defined by whether the user leans one direction or the other on each axis. Center scores (45-55) could place someone in the nearest archetype or a "balanced" variant.

### Design Principles for Archetype Names

1. **Politically grounded.** Every name should make immediate sense as a political identity. If you told someone at a barbecue "I'm a ___," they'd know roughly where you stand.
2. **Uses language real people already use.** Based on Gallup and YouGov polling, the labels Americans most commonly identify with are: conservative, moderate, progressive, libertarian, populist, and fiscal/social modifiers. We build on these.
3. **Still positive and non-partisan.** No archetype should feel like an insult. None should map 1:1 to a political party.
4. **Simple enough for anyone.** Each archetype gets a one-sentence "You believe..." description that a non-political person would read and say "yeah, that's me."

### How Archetypes Map to Axes

| # | Archetype | Economic | Social | Governance | One-Liner |
|---|-----------|----------|--------|------------|-----------|
| 1 | **Traditional Democrat** | Community Investment | Traditional | Institutional Trust | You believe government should take care of working families while preserving the values that hold communities together. |
| 2 | **Progressive** | Community Investment | Progressive | Institutional Trust | You believe in using government to drive real change — expanding rights, reducing inequality, and building a more inclusive society. |
| 3 | **Working Populist** | Community Investment | Traditional | Individual Liberty | You believe the system is rigged against regular people. You value tradition, hard work, and economic fairness — but you don't trust the people in charge to deliver it. |
| 4 | **Progressive Populist** | Community Investment | Progressive | Individual Liberty | You want bold social change but don't trust big institutions to get it right. You believe in people power — movements, not machines. |
| 5 | **Establishment Conservative** | Free Market | Traditional | Institutional Trust | You believe in free markets, traditional values, and strong institutions. Stability and order aren't boring — they're what makes everything else possible. |
| 6 | **Modern Moderate** | Free Market | Progressive | Institutional Trust | You're socially open-minded and fiscally practical. You believe in markets, progress, and working within the system to make things better. |
| 7 | **Constitutional Conservative** | Free Market | Traditional | Individual Liberty | You believe in limited government, personal responsibility, and the traditions that built this country. Freedom means the government stays out of your way. |
| 8 | **Classical Liberal** | Free Market | Progressive | Individual Liberty | Maximum freedom across the board. Free markets, open society, and a deep skepticism of anyone — left or right — who wants to tell you how to live. |

### Why These Names Work

- **People already use these terms.** "I'm a progressive populist," "I'm more of a classical liberal," "I'm a moderate" — these are things real people actually say. The quiz validates language they already identify with.
- **They're politically legible.** Unlike "Maverick" or "Trailblazer," every one of these names immediately communicates a political worldview. You don't need an explanation to get the gist.
- **They're still non-partisan.** "Traditional Democrat" doesn't mean you vote Democrat — it describes a set of values. "Establishment Conservative" doesn't mean you're a Republican — it describes how you think about markets and institutions. The descriptions make this clear.
- **They create interesting debate matchups.** A Progressive vs. a Constitutional Conservative is the classic matchup. But a Working Populist vs. a Progressive Populist? Two people who both distrust the system but disagree on social values — that's a compelling debate.
- **Every name is something you'd be comfortable sharing.** Nobody's going to hide their badge if they're a "Modern Moderate" or a "Classical Liberal." These are identities people wear with pride.

### Extended Descriptions (shown on results page)

**Traditional Democrat**
You believe in a government that shows up for working people — good jobs, affordable healthcare, strong schools. But you also value the things that hold communities together: faith, family, and the traditions that give life meaning. You're not interested in culture wars from either side. You just want a fair shake for people who work hard and play by the rules.

**Progressive**
You believe society should keep evolving — expanding who's included, closing the gaps between rich and poor, and using policy to build a fairer world. You trust that well-designed institutions and smart regulation can make a real difference. You're not naive about the system's flaws, but you believe the answer is fixing it, not burning it down.

**Working Populist**
You're skeptical of the people at the top — politicians, CEOs, media elites. You believe working people get squeezed while the powerful look out for themselves. You hold traditional values close, but you're not loyal to any political establishment. You want an economy that works for regular families and a government that stays honest.

**Progressive Populist**
You want real change — on climate, inequality, justice — but you don't trust big institutions to deliver it. You've seen how corporations capture regulators and politicians serve donors. You believe real progress comes from the ground up: movements, organizing, and people holding power accountable.

**Establishment Conservative**
You believe in proven things: free enterprise, strong national defense, the rule of law, and the moral foundations that have held society together for generations. You're not against change, but you think it should be gradual and grounded. Institutions aren't perfect, but they're better than chaos.

**Modern Moderate**
You don't fit neatly into a box — and you're fine with that. You lean toward free markets and practical policy but you're open-minded on social issues. You think both sides have good points and bad ones. You'd rather find what works than win an argument.

**Constitutional Conservative**
For you, it starts and ends with the Constitution. Limited government, individual rights, personal responsibility. You believe the best government is the one that does the least, and that communities and families — not federal agencies — are where real life happens. Freedom isn't negotiable.

**Classical Liberal**
You want maximum freedom — economic and personal. You believe people should be free to live how they want, spend how they want, and think how they want. You're skeptical of authority from any direction: left-wing cultural mandates and right-wing moral policing both miss the point. Live and let live.

### Archetype Badge Design Direction

Each archetype should have a distinct badge/icon with:
- A unique color from a carefully chosen palette (not red/blue — avoid partisan association)
- A simple icon or symbol that represents the archetype's core identity
- A consistent visual style across all 8 badges

**Suggested color palette (avoids red/blue partisan coding):**

| Archetype | Color | Hex | Reasoning |
|-----------|-------|-----|-----------|
| Traditional Democrat | Deep Teal | #0D7377 | Grounded, community |
| Progressive | Indigo | #4F46E5 | Forward momentum, systems |
| Working Populist | Burnt Orange | #C2410C | Grit, independence |
| Progressive Populist | Emerald | #059669 | Grassroots, growth |
| Establishment Conservative | Slate Blue | #475569 | Stability, structure |
| Modern Moderate | Violet | #7C3AED | Open-minded, balanced |
| Constitutional Conservative | Amber | #D97706 | Tradition, vigilance |
| Classical Liberal | Coral | #E11D48 | Bold, individual |

---

## Privacy Model

### Core Principle: Your Answers Are Yours

| Data | Visibility | User Control |
|------|-----------|-------------|
| Individual question answers | **Always private** | Cannot be made public. Never shown to other users, never used in public-facing features. |
| Axis scores (percentages) | **Private by default** | User can choose to display on their profile |
| Archetype label + badge | **Private by default** | User can choose to display on their profile |
| Compass dot position | **Private by default** | User can choose to display on their profile |

### Why This Matters

People will answer more honestly if they know their individual responses are private. A user might strongly agree that "drug use should be decriminalized" but not want that specific answer visible to friends, family, or employers. But they might be totally fine showing their "Trailblazer" badge — because the archetype is abstract enough to be comfortable sharing.

### Implementation Notes

- Quiz answers are stored encrypted and are only used for score calculation
- The profile settings page has a simple toggle: "Show my political compass on my profile" (off by default)
- When enabled, other users see: archetype badge + label, compass dot position, and axis percentages
- When disabled, other users see nothing about the user's political orientation
- Debate matching can still use the data internally (for interesting pairings) even when the profile is private

---

## Question Design Principles

### Rules for Every Question

1. **Single idea per question.** No double-barreled statements like "The government should regulate businesses and raise taxes." Those are two separate positions.

2. **Neutral framing.** No loaded language. Instead of "The government wastes taxpayer money on unnecessary programs," use "Government spending on public programs should be reduced."

3. **Balanced keying.** 5 positive-keyed + 5 negative-keyed per axis. This cancels out acquiescence bias.

4. **No proper nouns.** No references to specific politicians, parties, countries, or current events. Questions should be timeless — someone taking this quiz in 2028 should get the same quality experience as someone taking it today.

5. **Avoid social desirability traps.** Don't ask questions where there's an obviously "good" answer. Instead of "Should all people be treated equally?" (everyone says yes), ask about specific policy tradeoffs where reasonable people genuinely disagree.

6. **American-focused but not America-exclusive.** Since CommonSquare starts in the US, questions should be relevant to American political discourse — but framed generally enough that they could work internationally later.

---

## The 30 Questions

### Economic Axis (10 questions)

**E1 (+)** "A strong economy depends more on free enterprise than government programs."
→ Agree = Free Market direction

**E2 (−)** "Healthcare should be guaranteed by the government, even if it means higher taxes."
→ Agree = Community Investment direction

**E3 (+)** "Businesses generally do a better job than government at creating opportunities for people."
→ Agree = Free Market direction

**E4 (−)** "The minimum wage should be high enough that no full-time worker lives in poverty."
→ Agree = Community Investment direction

**E5 (+)** "Reducing regulations on businesses does more good than harm for the economy."
→ Agree = Free Market direction

**E6 (−)** "The government should invest more in public infrastructure, even if it increases the national debt."
→ Agree = Community Investment direction

**E7 (+)** "People are generally better off when they're free to make their own economic decisions without government involvement."
→ Agree = Free Market direction

**E8 (−)** "Wealthy individuals and corporations should pay significantly higher taxes to fund public services."
→ Agree = Community Investment direction

**E9 (+)** "Free trade between countries benefits most people, even if some domestic industries lose out."
→ Agree = Free Market direction

**E10 (−)** "Public universities and trade schools should be free or heavily subsidized."
→ Agree = Community Investment direction

---

### Social Axis (10 questions)

**S1 (+)** "Society benefits when it embraces new ideas about identity, culture, and relationships."
→ Agree = Progressive direction

**S2 (−)** "Traditional family structures are important for a stable society."
→ Agree = Traditional direction

**S3 (+)** "Drug policy should focus on treatment and personal choice, not criminal punishment."
→ Agree = Progressive direction

**S4 (−)** "Maintaining national borders and controlling immigration is essential to a country's identity."
→ Agree = Traditional direction

**S5 (+)** "The criminal justice system needs fundamental reform to address systemic inequities."
→ Agree = Progressive direction

**S6 (−)** "Religious and moral traditions play a valuable role in shaping public life."
→ Agree = Traditional direction

**S7 (+)** "Environmental protection should be prioritized even when it comes at an economic cost."
→ Agree = Progressive direction

**S8 (−)** "The right to own firearms is a fundamental individual freedom."
→ Agree = Traditional direction

**S9 (+)** "A country is strengthened by welcoming people from diverse backgrounds and cultures."
→ Agree = Progressive direction

**S10 (−)** "There are important differences between men and women that society should acknowledge rather than minimize."
→ Agree = Traditional direction

---

### Governance Axis (10 questions)

**G1 (+)** "People should be free to make their own choices, even if experts disagree with those choices."
→ Agree = Individual Liberty direction

**G2 (−)** "Scientific experts should have more influence over public policy than they currently do."
→ Agree = Institutional Trust direction

**G3 (+)** "Government surveillance programs are a greater threat to society than the problems they're designed to prevent."
→ Agree = Individual Liberty direction

**G4 (−)** "International organizations are important for maintaining peace and cooperation between countries."
→ Agree = Institutional Trust direction

**G5 (+)** "Most decisions that affect daily life should be made at the local level, not by the federal government."
→ Agree = Individual Liberty direction

**G6 (−)** "A strong central government is necessary to ensure fairness and consistency across the country."
→ Agree = Institutional Trust direction

**G7 (+)** "Major news organizations do more to shape public opinion than to inform it."
→ Agree = Individual Liberty direction

**G8 (−)** "The court system, despite its flaws, is the best way to resolve major social disputes."
→ Agree = Institutional Trust direction

**G9 (+)** "People should have the right to keep their personal data completely private from both government and corporations."
→ Agree = Individual Liberty direction

**G10 (−)** "Large-scale problems like climate change and pandemics require coordinated institutional responses — individual action isn't enough."
→ Agree = Institutional Trust direction

---

## Question Ordering

Questions should be **shuffled across all three axes** so the user doesn't experience 10 economic questions in a row followed by 10 social questions. A good default order alternates: E1, S1, G1, E2, S2, G2... etc. But the display order should be randomized per user to prevent order effects.

---

## Scoring Example

**User answers all 30 questions. Here's how one axis is calculated:**

Economic axis answers (using 0-4 scale):
| Q | Direction | Response | Score |
|---|-----------|----------|-------|
| E1 (+) | Free Market | Agree | 3 |
| E2 (−) | Community Investment | Strongly Agree | 0 (reversed) |
| E3 (+) | Free Market | Neutral | 2 |
| E4 (−) | Community Investment | Agree | 1 (reversed) |
| E5 (+) | Free Market | Disagree | 1 |
| E6 (−) | Community Investment | Neutral | 2 (reversed) |
| E7 (+) | Free Market | Agree | 3 |
| E8 (−) | Community Investment | Strongly Agree | 0 (reversed) |
| E9 (+) | Free Market | Neutral | 2 |
| E10 (−) | Community Investment | Agree | 1 (reversed) |

Raw score: 3+0+2+1+1+2+3+0+2+1 = **15 out of 40**
Percentage: (15/40) × 100 = **37.5%** → Leans Community Investment

Repeat for Social and Governance axes. Then map to archetype based on which side of 50% each axis falls on.

---

## Archetype Assignment Logic

```
if economic < 50:
  if social < 50:
    if governance < 50: archetype = "Guardian"
    else: archetype = "Maverick"
  else:
    if governance < 50: archetype = "Reformer"
    else: archetype = "Advocate"
else:
  if social < 50:
    if governance < 50: archetype = "Steward"
    else: archetype = "Sentinel"
  else:
    if governance < 50: archetype = "Visionary"
    else: archetype = "Trailblazer"
```

**Edge case:** If any axis score is exactly 50, lean toward the direction with the most strongly-answered questions on that axis. If still tied, assign the archetype closest to the user's overall profile.

---

## What Users See After Completing the Quiz

1. **Their compass position** — a dot on the 2D grid (Economic × Social) with the Governance score shown as a bar
2. **Their archetype** — name, badge, color, and a 2-3 sentence description
3. **Their axis breakdowns** — three percentage bars showing where they fall on each dimension
4. **A comparison prompt** — "See how you compare to other CommonSquare members" (only shows aggregate/anonymous data)
5. **A CTA** — "Claim your profile" to lock in the username and join the waitlist

---

## Future Considerations

- **Labels are a presentation layer, not the data model.** The real asset is the raw axis scores (3 percentages per user) and the individual question responses. Archetype names, descriptions, colors, and badge designs can all be changed at any time without users retaking the quiz. The database stores scores and answers — the labels are derived at display time. This means if we decide "Working Populist" should become "Independent Traditionalist" in v2, it's a frontend change, not a data migration.
- **Retake policy:** Users can retake the quiz, but their previous results are archived (not deleted). This lets us track how views evolve over time — which is an interesting data point for the platform.
- **Debate matching:** The scoring data (even when profile is private) can be used to create interesting matchups. Same-archetype debates are interesting (two Progressives disagreeing on HOW to achieve progress). Cross-archetype debates are the most compelling (Working Populist vs. Modern Moderate).
- **Localization:** Questions are written to be US-relevant but avoid US-specific references. If CommonSquare expands internationally, questions can be adapted without changing the underlying framework.
- **Validation:** Once we have enough users (1,000+), we should run factor analysis on the responses to verify that the three axes are actually measuring distinct dimensions. If two axes are highly correlated, we may need to adjust questions.

---

## Sources & References

- [The Political Compass](https://www.politicalcompass.org/test) — 2-axis model (economic + social)
- [Pew Research Political Typology (2021)](https://www.pewresearch.org/politics/2021/11/09/beyond-red-vs-blue-the-political-typology/) — 9-group typology using 27 items + cluster analysis
- [8values](https://8values.github.io/) — 4-axis model (economic, diplomatic, civil, society)
- [9axes](https://9axes.github.io/) — 9-axis political quiz
- [Moral Foundations Theory (Haidt)](https://moralfoundations.org/) — 6 moral foundations predicting political orientation
- [Likert Scale Best Practices (Scribbr)](https://www.scribbr.com/methodology/likert-scale/) — question design and bias mitigation
- [Response Bias in Self-Reports (PNAS, 2024)](https://www.pnas.org/doi/10.1073/pnas.2412807122) — acquiescence bias research
