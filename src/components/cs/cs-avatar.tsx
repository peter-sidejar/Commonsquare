import { CS } from "@/lib/cs";

interface CSAvatarProps {
  initials?: string;
  size?: number;
  tone?: "ink" | "violet" | "paper";
}

export function CSAvatar({ initials = "MK", size = 36, tone = "ink" }: CSAvatarProps) {
  const bg = tone === "ink" ? CS.ink : tone === "violet" ? CS.violet : CS.paper3;
  const fg = tone === "ink" || tone === "violet" ? CS.paper : CS.ink;
  return (
    <div
      className="font-sans"
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 500,
        fontSize: size * 0.4,
        letterSpacing: "-0.02em",
        flex: "0 0 auto",
      }}
    >
      {initials}
    </div>
  );
}
