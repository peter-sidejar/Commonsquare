"use client";

import { QuizProvider } from "@/contexts/quiz-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
