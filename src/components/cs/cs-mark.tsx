import { CS } from "@/lib/cs";

interface CSMarkProps {
  size?: number;
  ink?: string;
  accent?: string;
  strokeScale?: number;
}

export function CSMark({ size = 32, ink, accent, strokeScale = 1 }: CSMarkProps) {
  const s = size;
  const I = ink || CS.ink;
  const A = accent || CS.violet;
  const sw = Math.max(1.4, s * 0.06 * strokeScale);
  const sq = s * 0.58;
  const off = s * 0.06;
  const aX = off;
  const aY = off;
  const bX = s - sq - off;
  const bY = s - sq - off;
  const oX = Math.max(aX, bX);
  const oY = Math.max(aY, bY);
  const oW = Math.min(aX + sq, bX + sq) - oX;
  const oH = Math.min(aY + sq, bY + sq) - oY;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ display: "block" }}
      aria-hidden
    >
      <rect x={oX} y={oY} width={oW} height={oH} fill={A} />
      <rect x={aX} y={aY} width={sq} height={sq} fill="none" stroke={I} strokeWidth={sw} />
      <rect x={bX} y={bY} width={sq} height={sq} fill="none" stroke={I} strokeWidth={sw} />
    </svg>
  );
}
