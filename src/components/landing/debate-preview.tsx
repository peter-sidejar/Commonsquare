import { CS } from "@/lib/cs";
import { CSAvatar } from "@/components/cs/cs-avatar";
import { CSEyebrow } from "@/components/cs/cs-eyebrow";
import { CSCopy } from "./copy";

function DebateCard() {
  return (
    <div
      style={{
        borderRadius: 18,
        background: "#fff",
        border: `1px solid ${CS.rule2}`,
        overflow: "hidden",
        boxShadow:
          "0 1px 0 rgba(26,24,20,0.04), 0 12px 32px -16px rgba(26,24,20,0.18)",
      }}
    >
      <div
        className="px-6 pb-6 pt-7 md:px-8"
        style={{ borderBottom: `1px solid ${CS.rule}` }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px 5px 8px",
              borderRadius: 999,
              background: CS.violetT,
              color: CS.violetD,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: CS.violet,
              }}
            />
            {CSCopy.debate.live}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: CS.mute,
              letterSpacing: "0.06em",
            }}
          >
            {CSCopy.debate.status}
          </span>
        </div>
        <div
          className="font-sans"
          style={{
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: CS.ink,
            lineHeight: 1.2,
          }}
        >
          {CSCopy.debate.topic}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {(["a", "b"] as const).map((side, i) => {
          const d = CSCopy.debate[side];
          const initials =
            (d.name || "")
              .trim()
              .split(/\s+/)
              .map((w) => w[0])
              .filter(Boolean)
              .join("")
              .toUpperCase()
              .slice(0, 2) || "?";
          return (
            <div
              key={side}
              className="p-6 md:px-8"
              style={{
                borderLeft: i === 1 ? `1px solid ${CS.rule}` : "none",
                borderTop: i === 1 ? `1px solid ${CS.rule}` : "none",
              }}
            >
              <div className="flex items-center gap-3.5">
                <CSAvatar
                  initials={initials}
                  size={44}
                  tone={side === "a" ? "ink" : "violet"}
                />
                <div className="flex-1">
                  <div
                    className="font-sans"
                    style={{
                      fontWeight: 500,
                      fontSize: 17,
                      letterSpacing: "-0.015em",
                      color: CS.ink,
                    }}
                  >
                    {d.handle}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: CS.mute,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {d.archetype}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 16,
                      color: CS.ink,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {d.elo}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: CS.mute,
                      letterSpacing: "0.08em",
                    }}
                  >
                    ELO
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="font-mono flex items-center justify-between px-6 py-3.5 md:px-8"
        style={{
          background: CS.paper2,
          fontSize: 11,
          color: CS.mute,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span>{CSCopy.debate.watching}</span>
        <span style={{ color: CS.ink }}>Read the debate →</span>
      </div>
    </div>
  );
}

export function LandingDebate() {
  return (
    <section
      id="square"
      className="px-6 py-20 md:px-16 md:py-24"
      style={{ borderTop: `1px solid ${CS.rule}` }}
    >
      <CSEyebrow label={CSCopy.debate.eyebrow} num="04" />
      <h2
        className="font-sans"
        style={{
          margin: "24px 0 12px",
          fontWeight: 500,
          fontSize: "clamp(30px, 4.6vw, 44px)",
          letterSpacing: "-0.035em",
          color: CS.ink,
          maxWidth: 700,
        }}
      >
        {CSCopy.debate.title}
      </h2>
      <p
        className="font-sans mb-12"
        style={{
          margin: "0 0 48px",
          fontSize: 16,
          lineHeight: 1.55,
          color: CS.mute,
          maxWidth: 600,
        }}
      >
        {CSCopy.debate.body}
      </p>
      <DebateCard />
    </section>
  );
}
