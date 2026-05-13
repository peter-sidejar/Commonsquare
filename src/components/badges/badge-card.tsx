import { CS } from "@/lib/cs";
import { CSArchetypes, type Archetype } from "@/lib/archetypes";
import { BadgeMark } from "./badge-mark";

interface BadgeCardProps {
  arch: Archetype;
  size?: "sm" | "md" | "lg";
}

export function BadgeCard({ arch, size = "md" }: BadgeCardProps) {
  const dim =
    size === "sm"
      ? { w: 200, h: 260, mark: 84 }
      : size === "lg"
        ? { w: 300, h: 400, mark: 128 }
        : { w: 240, h: 320, mark: 100 };
  const index = CSArchetypes.findIndex((a) => a.id === arch.id) + 1;
  return (
    <div
      style={{
        width: dim.w,
        height: dim.h,
        background: CS.paper,
        border: `1px solid ${CS.rule2}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          background: `linear-gradient(180deg, ${arch.tint}14 0%, ${arch.tint}1f 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderBottom: `1px solid ${CS.rule}`,
        }}
      >
        <BadgeMark id={arch.id} size={dim.mark} accent={arch.tint} />
        <div
          className="font-mono"
          style={{
            position: "absolute",
            top: 12,
            left: 14,
            fontSize: 10,
            color: CS.mute,
            letterSpacing: "0.16em",
          }}
        >
          {`0${index} / 08`}
        </div>
        <div
          className="font-mono"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            fontSize: 10,
            color: arch.tint,
            letterSpacing: "0.12em",
            fontWeight: 600,
          }}
        >
          {arch.short}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div
          className="font-sans"
          style={{
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: CS.ink,
            lineHeight: 1.15,
            marginBottom: 4,
          }}
        >
          {arch.n}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            color: CS.mute,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ≈ {arch.pct} of users
        </div>
      </div>
    </div>
  );
}
