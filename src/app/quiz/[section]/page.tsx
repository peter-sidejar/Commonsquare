"use client";

import { useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQuiz, useQuizDispatch } from "@/contexts/quiz-context";
import { getQuestionsForSection, quizSections, questions } from "@/lib/questions";
import { calculateScores } from "@/lib/scoring";
import { classifyArchetype } from "@/lib/archetypes";
import { QuestionCard } from "@/components/question-card";
import { QuizProgress } from "@/components/quiz-progress";
import { Button } from "@/components/ui/button";
import type { LikertValue } from "@/types/quiz";

export default function QuizSectionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get("retake") === "1";
  const sectionId = Number(params.section);
  const quiz = useQuiz();
  const dispatch = useQuizDispatch();
  const hasDispatchedRetake = useRef(false);

  // On retake entry, reset quiz state but preserve email/username
  useEffect(() => {
    if (isRetake && sectionId === 1 && !hasDispatchedRetake.current) {
      hasDispatchedRetake.current = true;
      dispatch({ type: "RETAKE" });
    }
  }, [isRetake, sectionId, dispatch]);

  const section = quizSections.find((s) => s.id === sectionId);
  const sectionQuestions = getQuestionsForSection(sectionId);

  if (!section || sectionQuestions.length === 0) {
    router.replace("/quiz/1");
    return null;
  }

  const isFirstSection = sectionId === 1;
  const isLastSection = sectionId === quizSections.length;
  const allSectionAnswered = sectionQuestions.every((q) =>
    quiz.answers.has(q.id)
  );
  const totalAnswered = quiz.answers.size;

  function handleAnswer(questionId: number, value: LikertValue) {
    dispatch({ type: "SET_ANSWER", questionId, value });
  }

  function handlePrevious() {
    dispatch({ type: "SET_SECTION", section: sectionId - 1 });
    router.push(`/quiz/${sectionId - 1}`);
  }

  function handleNext() {
    dispatch({ type: "SET_SECTION", section: sectionId + 1 });
    router.push(`/quiz/${sectionId + 1}`);
  }

  function handleSeeResults() {
    const scores = calculateScores(quiz.answers);
    const archetype = classifyArchetype(scores);
    dispatch({
      type: "COMPLETE_QUIZ",
      scores,
      archetype: archetype.id,
    });
    router.push(isRetake ? "/results?retake=1" : "/results");
  }

  const questionsBeforeThisSection = quizSections
    .filter((s) => s.id < sectionId)
    .reduce((sum, s) => sum + s.questionIds.length, 0);

  return (
    <div className="space-y-8">
      <QuizProgress
        currentSection={sectionId}
        answeredCount={totalAnswered}
        totalQuestions={questions.length}
      />

      {/* Section header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Section {sectionId} of {quizSections.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {section.title}
        </h1>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {sectionQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={questionsBeforeThisSection + index + 1}
            totalQuestions={questions.length}
            value={quiz.answers.get(question.id)}
            onChange={(value) => handleAnswer(question.id, value)}
            index={index}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstSection}
        >
          ← Previous
        </Button>

        {isLastSection ? (
          <Button
            size="lg"
            onClick={handleSeeResults}
            disabled={totalAnswered < questions.length}
          >
            See Your Results →
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!allSectionAnswered}
          >
            Next Section →
          </Button>
        )}
      </div>
    </div>
  );
}
