import { CS } from "@/lib/cs";
import { CSEyebrow } from "@/components/cs/cs-eyebrow";
import { CSCopy } from "./copy";

export function LandingHow() {
  return (
    <section
      id="how"
      className="px-6 py-20 md:px-16 md:py-24"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <CSEyebrow label={CSCopy.how.eyebrow} num="02" />
      <h2
        className="font-sans"
        style={{
          margin: "24px 0 56px",
          fontWeight: 500,
          fontSize: "clamp(30px, 4.6vw, 44px)",
          letterSpacing: "-0.035em",
          color: CS.ink,
          maxWidth: 700,
        }}
      >
        {CSCopy.how.headline}
      </h2>
      <div className="flex flex-col">
        {CSCopy.how.steps.map((s, i) => (
          <div
            key={s.n}
            className="grid grid-cols-[60px_1fr] items-start gap-6 py-7 md:grid-cols-[80px_1fr_160px] md:items-center md:gap-8"
            style={{
              borderTop: i === 0 ? `1px solid ${CS.rule2}` : `1px solid ${CS.rule}`,
              borderBottom:
                i === CSCopy.how.steps.length - 1
                  ? `1px solid ${CS.rule2}`
                  : "none",
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 13,
                color: CS.violet,
                letterSpacing: "0.1em",
              }}
            >
              {s.n}
            </div>
            <div>
              <div
                className="font-sans"
                style={{
                  fontSize: "clamp(20px, 2.5vw, 24px)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: CS.ink,
                  marginBottom: 4,
                }}
              >
                {s.title}
              </div>
              <div
                className="font-sans"
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: CS.mute,
                  maxWidth: 540,
                }}
              >
                {s.body}
              </div>
              <div
                className="font-mono mt-3 md:hidden"
                style={{
                  fontSize: 11,
                  color: CS.mute,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {s.time}
              </div>
            </div>
            <div
              className="font-mono hidden text-right md:block"
              style={{
                fontSize: 12,
                color: CS.mute,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {s.time}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
