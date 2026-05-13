import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSBadge } from "@/components/cs/cs-badge";
import { CSButton } from "@/components/cs/cs-button";
import { CSCopy } from "./copy";

export function LandingHero() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-24 pt-12 text-center md:px-16 md:pb-36 md:pt-20">
      <div className="mb-9">
        <CSBadge>{CSCopy.hero.badge}</CSBadge>
      </div>
      <h1
        className="text-balance font-sans"
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "clamp(48px, 9vw, 92px)",
          lineHeight: 1.0,
          letterSpacing: "-0.045em",
          color: CS.ink,
        }}
      >
        {CSCopy.hero.h1a}
        <br />
        <span style={{ color: CS.violet }}>{CSCopy.hero.h1b}</span>
      </h1>
      <p
        className="font-sans"
        style={{
          margin: "32px auto 0",
          maxWidth: 600,
          fontSize: 19,
          lineHeight: 1.5,
          color: CS.mute,
          letterSpacing: "-0.005em",
        }}
      >
        {CSCopy.hero.sub}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/signup">
          <CSButton variant="primary" size="lg">
            {CSCopy.hero.cta} →
          </CSButton>
        </Link>
        <span
          className="font-sans"
          style={{ fontSize: 14, color: CS.mute }}
        >
          {CSCopy.hero.support}
        </span>
      </div>
    </div>
  );
}
