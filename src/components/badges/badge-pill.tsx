import type { Archetype } from "@/lib/archetypes";
import { BadgeMark } from "./badge-mark";

interface BadgePillProps {
  arch: Archetype;
  size?: "sm" | "md";
}

export function BadgePill({ arch, size = "md" }: BadgePillProps) {
  const h = size === "sm" ? 24 : 28;
  const fs = size === "sm" ? 11 : 12;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: h,
        paddingLeft: 4,
        paddingRight: 12,
        borderRadius: 999,
        background: `${arch.tint}14`,
        border: `1px solid ${arch.tint}33`,
      }}
    >
      <span
        style={{
          width: h - 8,
          height: h - 8,
          borderRadius: 999,
          background: `${arch.tint}22`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BadgeMark id={arch.id} size={(h - 8) * 0.72} accent={arch.tint} />
      </span>
      <span
        className="font-sans"
        style={{
          fontWeight: 500,
          fontSize: fs,
          letterSpacing: "-0.015em",
          color: arch.tint,
          whiteSpace: "nowrap",
        }}
      >
        {arch.n}
      </span>
    </span>
  );
}
