import { CS } from "@/lib/cs";
import type { Archetype } from "@/lib/archetypes";
import { BadgeMark } from "./badge-mark";

interface BadgeStampProps {
  arch: Archetype;
  size?: number;
  label?: boolean;
}

export function BadgeStamp({ arch, size = 56, label = false }: BadgeStampProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          background: `${arch.tint}1a`,
          border: `1px solid ${arch.tint}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <BadgeMark id={arch.id} size={size * 0.66} accent={arch.tint} />
      </div>
      {label ? (
        <div>
          <div
            className="font-sans"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: CS.ink,
              letterSpacing: "-0.015em",
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
            }}
          >
            {arch.short}
          </div>
        </div>
      ) : null}
    </div>
  );
}
