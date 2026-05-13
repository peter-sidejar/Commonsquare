"use client";

import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";

interface TopRowProps {
  step: string;
  backHref?: string;
}

export function OnboardingTopRow({ step, backHref }: TopRowProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-6">
      <div className="flex items-center gap-2.5">
        {backHref ? (
          <button
            onClick={() => router.push(backHref)}
            aria-label="Back"
            className="inline-flex items-center justify-center transition-colors hover:bg-paper2"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "transparent",
              border: `1px solid ${CS.rule2}`,
              color: CS.ink,
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
              marginRight: 6,
            }}
          >
            ←
          </button>
        ) : null}
        <CSMark size={20} />
        <span
          className="font-sans"
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: CS.ink,
          }}
        >
          commonsquare
        </span>
      </div>
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          color: CS.mute,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {step}
      </span>
    </div>
  );
}
