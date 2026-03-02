"use client";

import { LikertScale } from "@/components/likert-scale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Question, LikertValue } from "@/types/quiz";

const axisDisplay: Record<string, string> = {
  economic: "Economic",
  social: "Social",
  governance: "Governance",
};

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: LikertValue | undefined;
  onChange: (value: LikertValue) => void;
  index: number;
};

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant="secondary">
            {axisDisplay[question.axis] ?? question.axis}
          </Badge>
        </div>

        <p className="mb-6 text-lg font-medium leading-relaxed">
          &ldquo;{question.text}&rdquo;
        </p>

        <LikertScale value={value} onChange={onChange} />
      </CardContent>
    </Card>
  );
}
