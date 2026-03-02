"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizDispatch } from "@/contexts/quiz-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useQuizDispatch();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    dispatch({ type: "SET_EMAIL", email });
    router.push("/quiz");
  }

  return (
    <section className="border-t px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          The best debates haven&apos;t happened yet.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground sm:text-lg">
          Create your profile, discover your political compass, and be first in
          line when the arena opens.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="h-11"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Claim Your Spot
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Free to join. Your quiz answers are never stored.
          </p>
        </form>
      </div>
    </section>
  );
}
