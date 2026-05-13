import Link from "next/link";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSCopy } from "./copy";

export function LandingFinalCTA() {
  return (
    <section
      className="px-6 py-32 text-center md:px-16 md:py-36"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <h2
        className="text-balance font-sans mx-auto"
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "clamp(40px, 7vw, 72px)",
          lineHeight: 1.02,
          letterSpacing: "-0.045em",
          color: CS.ink,
          maxWidth: 880,
        }}
      >
        {CSCopy.finalCta.pre}{" "}
        <span style={{ color: CS.violet }}>{CSCopy.finalCta.title}</span>
      </h2>
      <p
        className="font-sans mx-auto"
        style={{
          margin: "24px auto 36px",
          maxWidth: 560,
          fontSize: 17,
          lineHeight: 1.5,
          color: CS.mute,
        }}
      >
        {CSCopy.finalCta.sub}
      </p>
      <Link href="/signup">
        <CSButton variant="primary" size="lg">
          {CSCopy.finalCta.cta} →
        </CSButton>
      </Link>
    </section>
  );
}
