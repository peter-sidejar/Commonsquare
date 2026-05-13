import { CS } from "@/lib/cs";
import { CSMark } from "./cs-mark";

interface CSWordmarkProps {
  size?: number;
  ink?: string;
  accent?: string;
}

export function CSWordmark({ size = 18, ink, accent }: CSWordmarkProps) {
  const I = ink || CS.ink;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.55,
      }}
    >
      <CSMark size={size * 1.45} ink={I} accent={accent} />
      <span
        className="font-sans"
        style={{
          fontWeight: 500,
          fontSize: size,
          letterSpacing: "-0.025em",
          color: I,
        }}
      >
        commonsquare
      </span>
    </span>
  );
}
