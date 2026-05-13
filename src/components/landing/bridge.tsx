import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSCopy } from "./copy";

export function LandingBridge() {
  return (
    <section className="px-6 py-24 text-center md:px-16 md:py-32">
      <div className="mx-auto flex max-w-[880px] flex-col items-center">
        <CSMark size={28} />
        <blockquote
          className="text-balance font-serif"
          style={{
            margin: "32px 0 0",
            fontWeight: 400,
            fontSize: "clamp(28px, 4.5vw, 44px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            color: CS.ink,
          }}
        >
          “{CSCopy.bridge.pull}”
        </blockquote>
      </div>
    </section>
  );
}
