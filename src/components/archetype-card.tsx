"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Archetype, QuizScores } from "@/types/quiz";
import { axisLabels } from "@/lib/questions";

type ArchetypeCardProps = {
  archetype: Archetype;
  scores: QuizScores;
};

function ScoreBar({
  label,
  lowLabel,
  highLabel,
  value,
}: {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
}) {
  const leansLabel =
    value < 45 ? lowLabel : value > 55 ? highLabel : "Balanced";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute top-0 h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border" />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{lowLabel}</span>
        <span className="font-medium text-foreground">{leansLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export function ArchetypeCard({ archetype, scores }: ArchetypeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ backgroundColor: archetype.color }}
          >
            {archetype.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl">
              {archetype.name}
            </CardTitle>
            <CardDescription className="text-sm italic">
              {archetype.oneLiner}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {archetype.description}
        </p>

        {/* Three axis score bars */}
        <div className="space-y-4">
          <ScoreBar
            label={axisLabels.economic.name}
            lowLabel={axisLabels.economic.low}
            highLabel={axisLabels.economic.high}
            value={scores.economic}
          />
          <ScoreBar
            label={axisLabels.social.name}
            lowLabel={axisLabels.social.low}
            highLabel={axisLabels.social.high}
            value={scores.social}
          />
          <ScoreBar
            label={axisLabels.governance.name}
            lowLabel={axisLabels.governance.low}
            highLabel={axisLabels.governance.high}
            value={scores.governance}
          />
        </div>
      </CardContent>
    </Card>
  );
}
