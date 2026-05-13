import { CS } from "@/lib/cs";

interface CSCompassProps {
  size?: number;
  showLabels?: boolean;
  showArchetype?: boolean;
  x?: number;
  y?: number;
  ink?: string;
  accent?: string;
}

export function CSCompass({
  size = 320,
  showLabels = true,
  showArchetype = true,
  x = 0.72,
  y = 0.34,
  ink,
  accent,
}: CSCompassProps) {
  const I = ink || CS.ink;
  const A = accent || CS.violet;
  const s = size;
  const pad = s * 0.14;
  const inner = s - pad * 2;
  const cx = pad + inner * x;
  const cy = pad + inner * y;
  const archetypes: Array<[number, number]> = [
    [0.18, 0.22],
    [0.5, 0.18],
    [0.82, 0.22],
    [0.18, 0.5],
    [0.82, 0.5],
    [0.18, 0.78],
    [0.5, 0.82],
    [0.82, 0.78],
  ];
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ display: "block" }}
      aria-hidden
    >
      {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
        <g key={i}>
          <line
            x1={pad + (inner / 10) * i}
            y1={pad}
            x2={pad + (inner / 10) * i}
            y2={pad + inner}
            stroke={I}
            strokeWidth={0.5}
            opacity={i === 5 ? 0.35 : 0.08}
          />
          <line
            x1={pad}
            y1={pad + (inner / 10) * i}
            x2={pad + inner}
            y2={pad + (inner / 10) * i}
            stroke={I}
            strokeWidth={0.5}
            opacity={i === 5 ? 0.35 : 0.08}
          />
        </g>
      ))}
      <rect
        x={pad}
        y={pad}
        width={inner}
        height={inner}
        fill="none"
        stroke={I}
        strokeWidth={1.4}
      />
      {archetypes.map(([ax, ay], i) => (
        <circle
          key={i}
          cx={pad + inner * ax}
          cy={pad + inner * ay}
          r={3}
          fill={I}
          opacity={0.22}
        />
      ))}
      <circle cx={cx} cy={cy} r={s * 0.045} fill={A} />
      <circle
        cx={cx}
        cy={cy}
        r={s * 0.075}
        fill="none"
        stroke={A}
        strokeWidth={1.2}
        opacity={0.5}
      />
      {showArchetype ? (
        <g>
          <line
            x1={cx}
            y1={cy}
            x2={cx + s * 0.12}
            y2={cy - s * 0.12}
            stroke={I}
            strokeWidth={0.8}
          />
          <circle cx={cx + s * 0.12} cy={cy - s * 0.12} r={2} fill={I} />
        </g>
      ) : null}
      {showLabels ? (
        <g
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: Math.max(8, s * 0.032),
            fill: I,
            opacity: 0.65,
          }}
          textAnchor="middle"
        >
          <text x={pad + inner / 2} y={pad - 8}>
            TRADITIONALIST
          </text>
          <text x={pad + inner / 2} y={pad + inner + 18}>
            PROGRESSIVE
          </text>
          <text
            x={pad - 8}
            y={pad + inner / 2}
            textAnchor="end"
            dominantBaseline="middle"
          >
            GOV.
          </text>
          <text
            x={pad + inner + 8}
            y={pad + inner / 2}
            textAnchor="start"
            dominantBaseline="middle"
          >
            MARKET
          </text>
        </g>
      ) : null}
    </svg>
  );
}
