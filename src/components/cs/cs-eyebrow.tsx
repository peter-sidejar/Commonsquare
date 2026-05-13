import { CS } from "@/lib/cs";

interface CSEyebrowProps {
  label: string;
  num?: string;
  centered?: boolean;
}

// The eyebrow row used at the top of each landing section: "01 — Why CommonSquare".
export function CSEyebrow({ label, num, centered = false }: CSEyebrowProps) {
  return (
    <div
      className="font-mono"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: centered ? "center" : "flex-start",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: CS.mute,
      }}
    >
      {num ? <span style={{ color: CS.violet }}>{num}</span> : null}
      {num ? (
        <span style={{ width: 16, height: 1, background: CS.rule2 }} />
      ) : null}
      <span style={{ color: CS.ink }}>{label}</span>
    </div>
  );
}
