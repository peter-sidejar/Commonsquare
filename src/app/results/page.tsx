"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuiz, useQuizDispatch } from "@/contexts/quiz-context";
import { archetypes } from "@/lib/archetypes";
import { CompassGraph } from "@/components/compass-graph";
import { ArchetypeCard } from "@/components/archetype-card";
import { UsernameClaim } from "@/components/username-claim";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { WaitlistResponse } from "@/types/waitlist";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get("retake") === "1";
  const quiz = useQuiz();
  const dispatch = useQuizDispatch();
  const [waitlistResult, setWaitlistResult] = useState<WaitlistResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameResolved, setUsernameResolved] = useState(isRetake);
  const hasSubmitted = useRef(false);

  // Redirect to lounge on successful submission
  useEffect(() => {
    if (waitlistResult?.success) {
      router.push("/lounge");
    }
  }, [waitlistResult, router]);

  // Auto-submit once username step is resolved (claimed or skipped)
  useEffect(() => {
    if (
      !quiz.isComplete ||
      !quiz.scores ||
      !quiz.archetype ||
      !usernameResolved ||
      waitlistResult ||
      isSubmitting ||
      hasSubmitted.current
    ) {
      return;
    }

    // For first-time submission, email is required
    if (!isRetake && !quiz.email) {
      return;
    }

    hasSubmitted.current = true;

    async function submitWaitlist() {
      setIsSubmitting(true);
      try {
        if (isRetake) {
          // PATCH: update scores only (session cookie identifies user)
          const res = await fetch("/api/waitlist", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              economicScore: quiz.scores!.economic,
              socialScore: quiz.scores!.social,
              governanceScore: quiz.scores!.governance,
              archetype: quiz.archetype,
            }),
          });
          const data = await res.json();
          setWaitlistResult(data);
        } else {
          // POST: new waitlist entry
          const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: quiz.email,
              username: quiz.username || undefined,
              interest: "debate",
              economicScore: quiz.scores!.economic,
              socialScore: quiz.scores!.social,
              governanceScore: quiz.scores!.governance,
              archetype: quiz.archetype,
            }),
          });
          const data: WaitlistResponse = await res.json();
          setWaitlistResult(data);
        }
      } catch {
        hasSubmitted.current = false;
        setWaitlistResult({
          success: false,
          error: isRetake
            ? "Could not update your profile. Please try again."
            : "Could not join the waitlist. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }

    submitWaitlist();
  }, [quiz.isComplete, quiz.scores, quiz.archetype, quiz.email, quiz.username, usernameResolved, waitlistResult, isSubmitting, isRetake]);

  const handleUsernameClaimed = useCallback(
    (username: string) => {
      dispatch({ type: "SET_USERNAME", username });
      setUsernameResolved(true);
    },
    [dispatch]
  );

  const handleUsernameSkipped = useCallback(() => {
    setUsernameResolved(true);
  }, []);

  if (!quiz.isComplete || !quiz.scores || !quiz.archetype) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Complete the quiz first
          </h1>
          <p className="mt-3 text-muted-foreground">
            Take the 30-question quiz to discover your political profile.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/quiz">Take the Quiz →</Link>
        </Button>
      </div>
    );
  }

  const archetype = archetypes[quiz.archetype];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link
            href={isRetake ? "/lounge" : "/"}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              CS
            </div>
            CommonSquare
          </Link>
          {isRetake ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lounge">Back to Lounge</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/quiz/1">Retake Quiz</Link>
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className="space-y-10">
          {/* Title */}
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              {isRetake ? "Updated Results" : "Your Results"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your Political Profile
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Here&apos;s where you landed on the political compass, based on
              your 30 responses.
            </p>
          </div>

          {/* Compass */}
          <div className="flex justify-center">
            <CompassGraph scores={quiz.scores} />
          </div>

          {/* Archetype */}
          <ArchetypeCard archetype={archetype} scores={quiz.scores} />

          {/* Username claim — only show for first-time signup, not retake */}
          {!isRetake && quiz.email && !usernameResolved && !waitlistResult && (
            <UsernameClaim
              onClaimed={handleUsernameClaimed}
              onSkipped={handleUsernameSkipped}
            />
          )}

          {/* Submission status */}
          {isSubmitting && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isRetake ? "Updating your profile..." : "Joining the waitlist..."}
                </p>
              </CardContent>
            </Card>
          )}

          {waitlistResult && !waitlistResult.success && (
            <Card className="border-destructive/20">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-destructive">
                  {waitlistResult.error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setWaitlistResult(null);
                    hasSubmitted.current = false;
                  }}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* If no email was captured (e.g. user navigated directly to /quiz) */}
          {!isRetake && !quiz.email && !waitlistResult && (
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to defend your position?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                CommonSquare is building a platform for real, respectful
                political debate. Join the waitlist to be among the first in.
              </p>
              <div className="mt-6">
                <Button asChild size="lg">
                  <Link href="/">Join the Waitlist →</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="pb-8 text-center">
            <Button variant="link" asChild>
              <Link href={isRetake ? "/lounge" : "/"}>
                {isRetake ? "Back to Lounge" : "Back to Home"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
