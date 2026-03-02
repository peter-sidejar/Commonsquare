import { Badge } from "@/components/ui/badge";

const SIZE = 320;
const CENTER = SIZE / 2;
const PADDING = 40;
const GRAPH_SIZE = SIZE - PADDING * 2;

// Example position for a "Classical Liberal" archetype (Economic=72, Social=68, Governance=75)
const DEMO_ECONOMIC = 72;
const DEMO_SOCIAL = 68;
const DEMO_GOVERNANCE = 75;
const dotX = PADDING + (DEMO_ECONOMIC / 100) * GRAPH_SIZE;
const dotY = PADDING + ((100 - DEMO_SOCIAL) / 100) * GRAPH_SIZE;

export function CompassPreviewSection() {
  return (
    <section className="border-t px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div>
            <p className="text-sm font-medium text-primary">Your Results</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              See where you actually stand
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Part of setting up your profile &mdash; your political compass is based
              on your real beliefs, not a party label.
            </p>
            <div className="mt-6">
              <Badge variant="outline" className="text-sm">
                Example: Classical Liberal
              </Badge>
            </div>
          </div>

          {/* Compass graphic */}
          <div className="flex flex-col items-center">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]"
              role="img"
              aria-label="Political compass example showing a Classical Liberal position"
            >
              {/* Background quadrants */}
              <rect x={PADDING} y={PADDING} width={GRAPH_SIZE / 2} height={GRAPH_SIZE / 2} fill="hsl(221 83% 53% / 0.06)" />
              <rect x={CENTER} y={PADDING} width={GRAPH_SIZE / 2} height={GRAPH_SIZE / 2} fill="hsl(0 84% 60% / 0.06)" />
              <rect x={PADDING} y={CENTER} width={GRAPH_SIZE / 2} height={GRAPH_SIZE / 2} fill="hsl(142 71% 45% / 0.06)" />
              <rect x={CENTER} y={CENTER} width={GRAPH_SIZE / 2} height={GRAPH_SIZE / 2} fill="hsl(45 93% 47% / 0.06)" />

              {/* Grid lines at 25% and 75% */}
              {[25, 75].map((pct) => {
                const xPos = PADDING + (pct / 100) * GRAPH_SIZE;
                const yPos = PADDING + ((100 - pct) / 100) * GRAPH_SIZE;
                return (
                  <g key={pct}>
                    <line x1={xPos} y1={PADDING} x2={xPos} y2={SIZE - PADDING} stroke="hsl(var(--border))" strokeWidth={0.5} />
                    <line x1={PADDING} y1={yPos} x2={SIZE - PADDING} y2={yPos} stroke="hsl(var(--border))" strokeWidth={0.5} />
                  </g>
                );
              })}

              {/* Center axes */}
              <line x1={CENTER} y1={PADDING} x2={CENTER} y2={SIZE - PADDING} stroke="hsl(var(--foreground))" strokeWidth={1} opacity={0.2} />
              <line x1={PADDING} y1={CENTER} x2={SIZE - PADDING} y2={CENTER} stroke="hsl(var(--foreground))" strokeWidth={1} opacity={0.2} />

              {/* Border */}
              <rect x={PADDING} y={PADDING} width={GRAPH_SIZE} height={GRAPH_SIZE} fill="none" stroke="hsl(var(--border))" strokeWidth={1} />

              {/* Axis labels */}
              <text x={PADDING - 4} y={CENTER} textAnchor="end" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" style={{ fontSize: "9px" }}>
                Community
              </text>
              <text x={SIZE - PADDING + 4} y={CENTER} textAnchor="start" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" style={{ fontSize: "9px" }}>
                Free Market
              </text>
              <text x={CENTER} y={PADDING - 8} textAnchor="middle" fill="hsl(var(--muted-foreground))" style={{ fontSize: "9px" }}>
                Progressive
              </text>
              <text x={CENTER} y={SIZE - PADDING + 14} textAnchor="middle" fill="hsl(var(--muted-foreground))" style={{ fontSize: "9px" }}>
                Traditional
              </text>

              {/* Crosshairs to dot */}
              <line x1={dotX} y1={PADDING} x2={dotX} y2={SIZE - PADDING} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeDasharray="4 4" opacity={0.4} />
              <line x1={PADDING} y1={dotY} x2={SIZE - PADDING} y2={dotY} stroke="hsl(var(--primary))" strokeWidth={0.8} strokeDasharray="4 4" opacity={0.4} />

              {/* User dot */}
              <circle cx={dotX} cy={dotY} r={14} fill="hsl(var(--primary) / 0.15)" />
              <circle cx={dotX} cy={dotY} r={6} fill="hsl(var(--primary))" stroke="white" strokeWidth={2} />
            </svg>

            {/* Governance bar */}
            <div className="mt-4 w-full max-w-[320px]">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Institutional Trust</span>
                <span className="text-xs font-medium text-foreground">Governance: {DEMO_GOVERNANCE}%</span>
                <span>Individual Liberty</span>
              </div>
              <div className="relative mt-1 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute top-0 h-full rounded-full bg-primary"
                  style={{ width: `${DEMO_GOVERNANCE}%` }}
                />
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
