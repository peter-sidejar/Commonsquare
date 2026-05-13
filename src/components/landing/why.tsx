import { CS } from "@/lib/cs";
import { CSEyebrow } from "@/components/cs/cs-eyebrow";
import { CSCopy } from "./copy";

export function LandingWhy() {
  return (
    <section
      id="why"
      className="px-6 py-20 md:px-16 md:py-24"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <CSEyebrow label={CSCopy.why.eyebrow} num="01" />
      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
        {CSCopy.why.cards.map((c, i) => (
          <div key={c.title}>
            <div
              className="font-mono mb-5 flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                fontSize: 11,
                letterSpacing: "0.1em",
                border: `1px solid ${CS.rule2}`,
                color: CS.violet,
                borderRadius: 6,
              }}
            >
              0{i + 1}
            </div>
            <h3
              className="font-sans mb-3"
              style={{
                margin: "0 0 12px",
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: "-0.025em",
                color: CS.ink,
              }}
            >
              {c.title}
            </h3>
            <p
              className="font-sans"
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.55,
                color: CS.mute,
              }}
            >
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
