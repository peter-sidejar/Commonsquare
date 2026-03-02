"use client";

import type { QuizScores } from "@/types/quiz";

type CompassGraphProps = {
  scores: QuizScores;
};

const SIZE = 320;
const CENTER = SIZE / 2;
const PADDING = 40;
const GRAPH_SIZE = SIZE - PADDING * 2;

/**
 * 2D political compass (Economic x-axis, Social y-axis) with a separate
 * governance bar below.
 *
 * Scores are 0-100 percentages:
 *   Economic: 0 (Community Investment) → 100 (Free Market)
 *   Social:   0 (Traditional) → 100 (Progressive)
 *   Governance: 0 (Institutional Trust) → 100 (Individual Liberty)
 */
export function CompassGraph({ scores }: CompassGraphProps) {
  // Map 0-100 scores to pixel positions
  const dotX = PADDING + (scores.economic / 100) * GRAPH_SIZE;
  // Invert Y: high social (Progressive) = top = small Y
  const dotY = PADDING + ((100 - scores.social) / 100) * GRAPH_SIZE;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]"
        overflow="visible"
      >
        {/* Background quadrants */}
        <rect
          x={PADDING}
          y={PADDING}
          width={GRAPH_SIZE / 2}
          height={GRAPH_SIZE / 2}
          fill="hsl(221 83% 53% / 0.06)"
        />
        <rect
          x={CENTER}
          y={PADDING}
          width={GRAPH_SIZE / 2}
          height={GRAPH_SIZE / 2}
          fill="hsl(0 84% 60% / 0.06)"
        />
        <rect
          x={PADDING}
          y={CENTER}
          width={GRAPH_SIZE / 2}
          height={GRAPH_SIZE / 2}
          fill="hsl(142 71% 45% / 0.06)"
        />
        <rect
          x={CENTER}
          y={CENTER}
          width={GRAPH_SIZE / 2}
          height={GRAPH_SIZE / 2}
          fill="hsl(45 93% 47% / 0.06)"
        />

        {/* Grid lines at 25% and 75% */}
        {[25, 75].map((pct) => {
          const xPos = PADDING + (pct / 100) * GRAPH_SIZE;
          const yPos = PADDING + ((100 - pct) / 100) * GRAPH_SIZE;
          return (
            <g key={pct}>
              <line
                x1={xPos}
                y1={PADDING}
                x2={xPos}
                y2={SIZE - PADDING}
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
              />
              <line
                x1={PADDING}
                y1={yPos}
                x2={SIZE - PADDING}
                y2={yPos}
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* Center axes (50% lines) */}
        <line
          x1={CENTER}
          y1={PADDING}
          x2={CENTER}
          y2={SIZE - PADDING}
          stroke="hsl(var(--foreground))"
          strokeWidth={1}
          opacity={0.2}
        />
        <line
          x1={PADDING}
          y1={CENTER}
          x2={SIZE - PADDING}
          y2={CENTER}
          stroke="hsl(var(--foreground))"
          strokeWidth={1}
          opacity={0.2}
        />

        {/* Border */}
        <rect
          x={PADDING}
          y={PADDING}
          width={GRAPH_SIZE}
          height={GRAPH_SIZE}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />

        {/* Axis labels */}
        <text
          x={PADDING - 4}
          y={CENTER}
          textAnchor="end"
          dominantBaseline="middle"
          fill="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
        >
          Community
        </text>
        <text
          x={SIZE - PADDING + 4}
          y={CENTER}
          textAnchor="start"
          dominantBaseline="middle"
          fill="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
        >
          Free Market
        </text>
        <text
          x={CENTER}
          y={PADDING - 8}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
        >
          Progressive
        </text>
        <text
          x={CENTER}
          y={SIZE - PADDING + 14}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
        >
          Traditional
        </text>

        {/* Crosshairs to dot */}
        <line
          x1={dotX}
          y1={PADDING}
          x2={dotX}
          y2={SIZE - PADDING}
          stroke="hsl(var(--primary))"
          strokeWidth={0.8}
          strokeDasharray="4 4"
          opacity={0.5}
        />
        <line
          x1={PADDING}
          y1={dotY}
          x2={SIZE - PADDING}
          y2={dotY}
          stroke="hsl(var(--primary))"
          strokeWidth={0.8}
          strokeDasharray="4 4"
          opacity={0.5}
        />

        {/* User dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r={14}
          fill="hsl(var(--primary) / 0.15)"
        />
        <circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill="hsl(var(--primary))"
          stroke="white"
          strokeWidth={2}
        />
      </svg>

      {/* Legend */}
      <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
        <span>{"\u2190"} Economic {"\u2192"}</span>
        <span>{"\u2191"} Social {"\u2193"}</span>
      </div>

      {/* Governance bar */}
      <div className="mt-5 w-full max-w-[320px]">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Institutional Trust</span>
          <span className="font-medium text-foreground">
            Governance: {scores.governance}%
          </span>
          <span>Individual Liberty</span>
        </div>
        <div className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute top-0 h-full rounded-full bg-primary transition-all"
            style={{ width: `${scores.governance}%` }}
          />
          {/* Center tick */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border" />
        </div>
      </div>
    </div>
  );
}
