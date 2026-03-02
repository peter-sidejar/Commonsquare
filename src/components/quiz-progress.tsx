"use client";

import { Progress } from "@/components/ui/progress";
import { quizSections } from "@/lib/questions";

type QuizProgressProps = {
  currentSection: number;
  answeredCount: number;
  totalQuestions: number;
};

export function QuizProgress({
  currentSection,
  answeredCount,
  totalQuestions,
}: QuizProgressProps) {
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Section {currentSection} of {quizSections.length}
        </span>
        <span className="text-muted-foreground">
          {answeredCount} of {totalQuestions} answered
        </span>
      </div>
      <Progress value={progressPercent} />
    </div>
  );
}
