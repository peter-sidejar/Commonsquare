// Locked archetype catalog — names, colors, descriptions are non-negotiable.
// IDs are stable for database use. Re-ordering is forbidden.

export type ArchetypeId =
  | "td"
  | "pr"
  | "wp"
  | "pp"
  | "ec"
  | "mm"
  | "cc"
  | "cl";

export interface Archetype {
  id: ArchetypeId;
  n: string;
  tint: string;
  pct: string;
  short: string;
  desc: string;
}

export const CSArchetypes: Archetype[] = [
  {
    id: "td",
    n: "Traditional Democrat",
    tint: "#3B6E5C",
    pct: "14%",
    short: "TD",
    desc: "Community-first, institutional, generous on the social safety net.",
  },
  {
    id: "pr",
    n: "Progressive",
    tint: "#5F4FA8",
    pct: "17%",
    short: "PR",
    desc: "Forward-leaning on social issues. Trusts institutions to lead change.",
  },
  {
    id: "wp",
    n: "Working Populist",
    tint: "#A86D2E",
    pct: "11%",
    short: "WP",
    desc: "Labor-rooted, market-skeptical, traditional on social questions.",
  },
  {
    id: "pp",
    n: "Progressive Populist",
    tint: "#3F7A6A",
    pct: "9%",
    short: "PP",
    desc: "Community-investment economics with progressive social values.",
  },
  {
    id: "ec",
    n: "Establishment Conservative",
    tint: "#4D556B",
    pct: "13%",
    short: "EC",
    desc: "Institutional, market-friendly, slow-and-steady on social change.",
  },
  {
    id: "mm",
    n: "Modern Moderate",
    tint: "#6E5BAF",
    pct: "15%",
    short: "MM",
    desc: "Sits near the center on all three axes. Argues case by case.",
  },
  {
    id: "cc",
    n: "Constitutional Conservative",
    tint: "#A8862E",
    pct: "12%",
    short: "CC",
    desc: "Tradition + market + limited government. Anchored in first principles.",
  },
  {
    id: "cl",
    n: "Classical Liberal",
    tint: "#B8552A",
    pct: "9%",
    short: "CL",
    desc: "Free markets, civil liberties, skeptical of expansive government.",
  },
];

// Reference positions on the 3-axis compass (0..100). The user's archetype is
// whichever reference point is closest (Euclidean) to their (e, s, g) scores.
export const ARCH_REF: Record<ArchetypeId, { e: number; s: number; g: number }> = {
  td: { e: 28, s: 38, g: 30 },
  pr: { e: 32, s: 72, g: 42 },
  wp: { e: 28, s: 30, g: 62 },
  pp: { e: 28, s: 70, g: 64 },
  ec: { e: 70, s: 30, g: 32 },
  mm: { e: 50, s: 50, g: 50 },
  cc: { e: 72, s: 30, g: 74 },
  cl: { e: 78, s: 64, g: 78 },
};

export function getArchetype(id: ArchetypeId): Archetype {
  const a = CSArchetypes.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype: ${id}`);
  return a;
}
