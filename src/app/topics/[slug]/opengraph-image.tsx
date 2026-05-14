import { ImageResponse } from "next/og";
import { getTopicBySlugServer } from "@/lib/topics-server";

// Dynamic 1200×630 OG image rendered at request time on the edge.
// Social platforms cache the result by URL, so this runs once per share
// rather than once per pageview.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CommonSquare — Today's Topic";

const INK = "#1A1814";
const PAPER = "#F4F1EA";
const VIOLET = "#5F4FA8";

interface Props {
  params: { slug: string };
}

// Sizes the question text based on character count so we don't overflow
// for long questions. ~Empirical thresholds; revisit once we see real data.
function questionFontSize(text: string): number {
  const len = text.length;
  if (len <= 60) return 84;
  if (len <= 100) return 72;
  if (len <= 140) return 60;
  return 50;
}

// Intersect mark — two overlapping orthogonal squares with a violet overlap.
// Rendered as positioned divs so it works inside Satori without depending on
// SVG attribute support.
function CSMark({ size: s = 48 }: { size?: number }) {
  const sq = Math.round(s * 0.58);
  const off = Math.round(s * 0.06);
  const stroke = Math.max(2, Math.round(s * 0.06));
  // The two squares overlap in the center. The overlap rectangle's
  // width/height is sq - (sq - 2*off) when offset by `off` from each edge.
  const overlapStart = s - sq - off;
  const overlapSize = sq + off - overlapStart;
  return (
    <div
      style={{
        position: "relative",
        width: s,
        height: s,
        display: "flex",
      }}
    >
      {/* Overlap fill — sits behind the stroked squares */}
      <div
        style={{
          position: "absolute",
          left: overlapStart,
          top: overlapStart,
          width: overlapSize,
          height: overlapSize,
          background: VIOLET,
        }}
      />
      {/* Upper-left square */}
      <div
        style={{
          position: "absolute",
          left: off,
          top: off,
          width: sq,
          height: sq,
          border: `${stroke}px solid ${PAPER}`,
        }}
      />
      {/* Lower-right square */}
      <div
        style={{
          position: "absolute",
          left: s - sq - off,
          top: s - sq - off,
          width: sq,
          height: sq,
          border: `${stroke}px solid ${PAPER}`,
        }}
      />
    </div>
  );
}

export default async function Image({ params }: Props) {
  const topic = await getTopicBySlugServer(params.slug);
  const question = topic?.debate_question ?? "Debate ideas. Not political parties.";
  const tags = topic?.tags?.slice(0, 3) ?? [];
  const fontSize = questionFontSize(question);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: PAPER,
          padding: 72,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <CSMark size={56} />
            <span
              style={{
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: "-0.025em",
              }}
            >
              commonsquare
            </span>
          </div>
          {topic ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 22px",
                border: `1px solid rgba(244,241,234,0.3)`,
                borderRadius: 999,
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: VIOLET,
                }}
              />
              Today&rsquo;s Topic
            </div>
          ) : null}
        </div>

        {/* Question — hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1056,
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: PAPER,
            }}
          >
            {question}
          </div>
          {tags.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 36,
              }}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 20,
                    color: "rgba(244,241,234,0.55)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: "rgba(244,241,234,0.7)",
              letterSpacing: "-0.005em",
            }}
          >
            Read both sides · vote · debate
          </span>
          <span
            style={{
              fontSize: 24,
              color: VIOLET,
              letterSpacing: "0.01em",
            }}
          >
            commonsquare.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
