import type { Archetype, ArchetypeId, QuizScores } from "@/types/quiz";

export const archetypes: Record<ArchetypeId, Archetype> = {
  "traditional-democrat": {
    id: "traditional-democrat",
    name: "Traditional Democrat",
    oneLiner:
      "You believe government should take care of working families while preserving the values that hold communities together.",
    description:
      "You believe in a government that shows up for working people \u2014 good jobs, affordable healthcare, strong schools. But you also value the things that hold communities together: faith, family, and the traditions that give life meaning. You\u2019re not interested in culture wars from either side. You just want a fair shake for people who work hard and play by the rules.",
    color: "#0D7377",
  },
  progressive: {
    id: "progressive",
    name: "Progressive",
    oneLiner:
      "You believe in using government to drive real change \u2014 expanding rights, reducing inequality, and building a more inclusive society.",
    description:
      "You believe society should keep evolving \u2014 expanding who\u2019s included, closing the gaps between rich and poor, and using policy to build a fairer world. You trust that well-designed institutions and smart regulation can make a real difference. You\u2019re not naive about the system\u2019s flaws, but you believe the answer is fixing it, not burning it down.",
    color: "#4F46E5",
  },
  "working-populist": {
    id: "working-populist",
    name: "Working Populist",
    oneLiner:
      "You believe the system is rigged against regular people. You value tradition, hard work, and economic fairness \u2014 but you don\u2019t trust the people in charge to deliver it.",
    description:
      "You\u2019re skeptical of the people at the top \u2014 politicians, CEOs, media elites. You believe working people get squeezed while the powerful look out for themselves. You hold traditional values close, but you\u2019re not loyal to any political establishment. You want an economy that works for regular families and a government that stays honest.",
    color: "#C2410C",
  },
  "progressive-populist": {
    id: "progressive-populist",
    name: "Progressive Populist",
    oneLiner:
      "You want bold social change but don\u2019t trust big institutions to get it right. You believe in people power \u2014 movements, not machines.",
    description:
      "You want real change \u2014 on climate, inequality, justice \u2014 but you don\u2019t trust big institutions to deliver it. You\u2019ve seen how corporations capture regulators and politicians serve donors. You believe real progress comes from the ground up: movements, organizing, and people holding power accountable.",
    color: "#059669",
  },
  "establishment-conservative": {
    id: "establishment-conservative",
    name: "Establishment Conservative",
    oneLiner:
      "You believe in free markets, traditional values, and strong institutions. Stability and order aren\u2019t boring \u2014 they\u2019re what makes everything else possible.",
    description:
      "You believe in proven things: free enterprise, strong national defense, the rule of law, and the moral foundations that have held society together for generations. You\u2019re not against change, but you think it should be gradual and grounded. Institutions aren\u2019t perfect, but they\u2019re better than chaos.",
    color: "#475569",
  },
  "modern-moderate": {
    id: "modern-moderate",
    name: "Modern Moderate",
    oneLiner:
      "You\u2019re socially open-minded and fiscally practical. You believe in markets, progress, and working within the system to make things better.",
    description:
      "You don\u2019t fit neatly into a box \u2014 and you\u2019re fine with that. You lean toward free markets and practical policy but you\u2019re open-minded on social issues. You think both sides have good points and bad ones. You\u2019d rather find what works than win an argument.",
    color: "#7C3AED",
  },
  "constitutional-conservative": {
    id: "constitutional-conservative",
    name: "Constitutional Conservative",
    oneLiner:
      "You believe in limited government, personal responsibility, and the traditions that built this country. Freedom means the government stays out of your way.",
    description:
      "For you, it starts and ends with the Constitution. Limited government, individual rights, personal responsibility. You believe the best government is the one that does the least, and that communities and families \u2014 not federal agencies \u2014 are where real life happens. Freedom isn\u2019t negotiable.",
    color: "#D97706",
  },
  "classical-liberal": {
    id: "classical-liberal",
    name: "Classical Liberal",
    oneLiner:
      "Maximum freedom across the board. Free markets, open society, and a deep skepticism of anyone \u2014 left or right \u2014 who wants to tell you how to live.",
    description:
      "You want maximum freedom \u2014 economic and personal. You believe people should be free to live how they want, spend how they want, and think how they want. You\u2019re skeptical of authority from any direction: left-wing cultural mandates and right-wing moral policing both miss the point. Live and let live.",
    color: "#E11D48",
  },
};

/**
 * Classify a user into one of 8 archetypes based on their 3-axis scores.
 *
 * Each axis is split at 50%:
 *   Economic < 50 = Community Investment, >= 50 = Free Market
 *   Social   < 50 = Traditional,         >= 50 = Progressive
 *   Governance < 50 = Institutional Trust, >= 50 = Individual Liberty
 *
 * The 8 combinations map to 8 archetypes.
 */
export function classifyArchetype(scores: QuizScores): Archetype {
  const econ = scores.economic >= 50; // true = Free Market
  const soc = scores.social >= 50; // true = Progressive
  const gov = scores.governance >= 50; // true = Individual Liberty

  if (!econ && !soc && !gov) return archetypes["traditional-democrat"];
  if (!econ && soc && !gov) return archetypes["progressive"];
  if (!econ && !soc && gov) return archetypes["working-populist"];
  if (!econ && soc && gov) return archetypes["progressive-populist"];
  if (econ && !soc && !gov) return archetypes["establishment-conservative"];
  if (econ && soc && !gov) return archetypes["modern-moderate"];
  if (econ && !soc && gov) return archetypes["constitutional-conservative"];
  // econ && soc && gov
  return archetypes["classical-liberal"];
}
