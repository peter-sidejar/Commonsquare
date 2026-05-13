import { CS } from "@/lib/cs";
import { CSCompass } from "@/components/cs/cs-compass";
import { CSEyebrow } from "@/components/cs/cs-eyebrow";
import { CSCopy } from "./copy";

export function LandingCompass() {
  return (
    <section
      id="compass"
      className="px-6 py-24 text-center md:px-16"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <CSEyebrow label={CSCopy.compass.eyebrow} num="03" centered />
      <h2
        className="font-sans mx-auto"
        style={{
          margin: "24px auto 24px",
          fontWeight: 500,
          fontSize: "clamp(30px, 4.6vw, 44px)",
          letterSpacing: "-0.035em",
          color: CS.ink,
          maxWidth: 760,
        }}
      >
        {CSCopy.compass.title}
      </h2>
      <p
        className="font-sans mx-auto mb-14"
        style={{
          margin: "0 auto 56px",
          maxWidth: 620,
          fontSize: 16,
          lineHeight: 1.55,
          color: CS.mute,
        }}
      >
        {CSCopy.compass.body}
      </p>
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-14">
        <CSCompass size={360} x={0.72} y={0.34} />
        <div className="max-w-[280px] text-left">
          <div
            className="font-mono mb-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: CS.violetT,
              fontSize: 11,
              color: CS.violetD,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: CS.violet,
              }}
            />
            Your archetype
          </div>
          <div
            className="font-sans mb-2"
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: CS.ink,
            }}
          >
            {CSCopy.compass.sampleArchetype}
          </div>
          <div
            className="font-sans"
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: CS.mute,
            }}
          >
            {CSCopy.compass.sampleBlurb}
          </div>
        </div>
      </div>
    </section>
  );
}
