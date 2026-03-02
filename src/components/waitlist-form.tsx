"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ArchetypeId } from "@/types/quiz";
import type { WaitlistInterest, WaitlistResponse } from "@/types/waitlist";

type WaitlistFormProps = {
  economicScore: number;
  socialScore: number;
  archetype: ArchetypeId;
};

export function WaitlistForm({
  economicScore,
  socialScore,
  archetype,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [interest, setInterest] = useState<WaitlistInterest>("debate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<WaitlistResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          state: state || undefined,
          interest,
          economicScore,
          socialScore,
          archetype,
        }),
      });

      const data: WaitlistResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Something went wrong. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">You&apos;re on the list!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;re <span className="font-semibold text-foreground">#{result.position}</span> on the waitlist.
            We&apos;ll reach out when CommonSquare launches.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription>
          Be among the first to debate on CommonSquare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State (optional)</Label>
            <Input
              id="state"
              type="text"
              placeholder="e.g. California"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          {/* Interest toggle */}
          <div className="space-y-2">
            <Label>I want to...</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={interest === "debate" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setInterest("debate")}
              >
                Debate
              </Button>
              <Button
                type="button"
                variant={interest === "watch" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setInterest("watch")}
              >
                Watch
              </Button>
            </div>
          </div>

          {/* Error */}
          {result?.error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {result.error}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join the Waitlist"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll never share your email. Your quiz responses are not stored.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
