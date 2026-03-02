"use client";

import { useRouter } from "next/navigation";
import { CompassGraph } from "@/components/compass-graph";
import { ArchetypeCard } from "@/components/archetype-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { archetypes } from "@/lib/archetypes";
import type { WaitlistProfile } from "@/types/waitlist";
import type { ArchetypeId, QuizScores } from "@/types/quiz";
import Link from "next/link";

type LoungeProfileProps = {
  profile: WaitlistProfile;
};

export function LoungeProfile({ profile }: LoungeProfileProps) {
  const router = useRouter();
  const archetype = archetypes[profile.archetype as ArchetypeId];
  const scores: QuizScores = {
    economic: profile.economic_score,
    social: profile.social_score,
    governance: profile.governance_score,
  };

  async function handleSignOut() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link
            href="/lounge"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              CS
            </div>
            CommonSquare
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <div className="space-y-10">
          {/* Welcome */}
          <div className="text-center">
            <p className="text-sm font-medium text-primary">The Lounge</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {profile.username
                ? `Welcome, @${profile.username}`
                : "Welcome back"}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              You&apos;re in. Sit tight while we finish building the arena.
            </p>
          </div>

          {/* Waitlist position */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Your waitlist position
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll reach out when CommonSquare launches.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Signed up</p>
                <p className="text-sm font-medium">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Compass */}
          <div>
            <h2 className="mb-4 text-center text-lg font-semibold">
              Your Political Compass
            </h2>
            <div className="flex justify-center">
              <CompassGraph scores={scores} />
            </div>
          </div>

          {/* Archetype */}
          {archetype && <ArchetypeCard archetype={archetype} scores={scores} />}

          {/* Retake */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Think your answers have changed? Retake the quiz to update your
              profile.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/quiz/1?retake=1">Retake Quiz</Link>
            </Button>
          </div>

          {/* Footer */}
          <div className="pb-8 text-center">
            <p className="text-xs text-muted-foreground">
              Signed in as {profile.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
