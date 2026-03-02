"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizDispatch } from "@/contexts/quiz-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
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
    <section className="relative flex min-h-[85vh] flex-col justify-center px-6">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[20%] -top-[30%] h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[15%] h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <Badge variant="secondary" className="mb-6">
          The arena for ideas is opening
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Debate Ideas.
          <br />
          <span className="text-primary">Not Political Parties.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          Watch real people debate real issues on video. Vote on who made the
          better case. Or step into the arena yourself. It&apos;s up to you.
        </p>

        {/* Email capture → quiz */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md" id="waitlist">
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
            Free to join. Watch, vote, or debate — your call.
          </p>
        </form>
      </div>
    </section>
  );
}
