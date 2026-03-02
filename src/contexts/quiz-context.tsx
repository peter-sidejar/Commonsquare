"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { LikertValue, QuizScores, ArchetypeId } from "@/types/quiz";

type QuizState = {
  email: string | null;
  username: string | null;
  answers: Map<number, LikertValue>;
  currentSection: number;
  scores: QuizScores | null;
  archetype: ArchetypeId | null;
  isComplete: boolean;
};

type QuizAction =
  | { type: "SET_EMAIL"; email: string }
  | { type: "SET_USERNAME"; username: string }
  | { type: "SET_ANSWER"; questionId: number; value: LikertValue }
  | { type: "SET_SECTION"; section: number }
  | { type: "COMPLETE_QUIZ"; scores: QuizScores; archetype: ArchetypeId }
  | { type: "RESET" }
  | { type: "RETAKE" };

const initialState: QuizState = {
  email: null,
  username: null,
  answers: new Map(),
  currentSection: 1,
  scores: null,
  archetype: null,
  isComplete: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.email };
    case "SET_USERNAME":
      return { ...state, username: action.username };
    case "SET_ANSWER": {
      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, action.value);
      return { ...state, answers: newAnswers };
    }
    case "SET_SECTION":
      return { ...state, currentSection: action.section };
    case "COMPLETE_QUIZ":
      return {
        ...state,
        scores: action.scores,
        archetype: action.archetype,
        isComplete: true,
      };
    case "RESET":
      return { ...initialState, answers: new Map() };
    case "RETAKE":
      return {
        ...initialState,
        answers: new Map(),
        email: state.email,
        username: state.username,
      };
    default:
      return state;
  }
}

const QuizContext = createContext<QuizState>(initialState);
const QuizDispatchContext = createContext<Dispatch<QuizAction>>(() => {});

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    answers: new Map(),
  });

  return (
    <QuizContext.Provider value={state}>
      <QuizDispatchContext.Provider value={dispatch}>
        {children}
      </QuizDispatchContext.Provider>
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}

export function useQuizDispatch() {
  return useContext(QuizDispatchContext);
}
