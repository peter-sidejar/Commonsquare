"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UsernameStatus } from "@/types/quiz";

type UsernameClaimProps = {
  onClaimed: (username: string) => void;
  onSkipped: () => void;
};

export function UsernameClaim({ onClaimed, onSkipped }: UsernameClaimProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced availability check
  useEffect(() => {
    if (value.length < 3) {
      setStatus("idle");
      setError(null);
      return;
    }

    // Quick client-side format check
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
      setStatus("invalid");
      setError(
        !/^[a-zA-Z]/.test(value)
          ? "Must start with a letter"
          : "Only letters, numbers, and underscores"
      );
      return;
    }

    if (value.length > 20) {
      setStatus("invalid");
      setError("Must be 20 characters or fewer");
      return;
    }

    setStatus("checking");
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        if (data.available) {
          setStatus("available");
          setError(null);
        } else {
          setStatus(data.error ? "invalid" : "taken");
          setError(data.error || "This handle is taken");
        }
      } catch {
        setStatus("idle");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value]);

  const handleClaim = useCallback(async () => {
    if (status !== "available" || isSubmitting) return;
    setIsSubmitting(true);

    // One final availability check before claiming
    try {
      const res = await fetch(
        `/api/username/check?username=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      if (!data.available) {
        setStatus("taken");
        setError(data.error || "This handle was just claimed");
        setIsSubmitting(false);
        return;
      }
    } catch {
      setIsSubmitting(false);
      return;
    }

    onClaimed(value);
  }, [status, isSubmitting, value, onClaimed]);

  const canClaim = status === "available" && !isSubmitting;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Claim your handle</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This is how you&apos;ll show up in debates on CommonSquare.
          </p>
        </div>

        {/* Input with @ prefix */}
        <div className="mx-auto mt-6 max-w-sm">
          <div className="flex items-center gap-0">
            <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm font-medium text-muted-foreground">
              @
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\s/g, ""))}
              placeholder="your_handle"
              maxLength={20}
              autoFocus
              className="flex h-9 w-full rounded-r-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            />
          </div>

          {/* Status indicator */}
          <div className="mt-2 h-5">
            {status === "checking" && (
              <p className="text-xs text-muted-foreground">Checking...</p>
            )}
            {status === "available" && (
              <p className="text-xs text-green-600">
                <span className="mr-1">✓</span>
                This handle is available
              </p>
            )}
            {(status === "taken" || status === "invalid") && error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Claim button */}
          <Button
            className="mt-3 w-full"
            size="lg"
            onClick={handleClaim}
            disabled={!canClaim}
          >
            {isSubmitting
              ? "Claiming..."
              : canClaim
                ? `Claim @${value}`
                : "Claim Your Handle"}
          </Button>

          {/* Skip link */}
          <button
            type="button"
            onClick={onSkipped}
            className="mt-3 block w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip for now — you can claim a handle later
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
