import type { ReactNode, CSSProperties } from "react";
import { CS } from "@/lib/cs";

interface CSBadgeProps {
  children: ReactNode;
  style?: CSSProperties;
  dot?: boolean;
}

export function CSBadge({ children, style, dot = true }: CSBadgeProps) {
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px 6px 10px",
        border: `1px solid ${CS.rule2}`,
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: CS.ink,
        background: "transparent",
        ...style,
      }}
    >
      {dot ? (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: CS.violet,
            boxShadow: `0 0 0 3px ${CS.violetT}`,
          }}
        />
      ) : null}
      {children}
    </span>
  );
}
