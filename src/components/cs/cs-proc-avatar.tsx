import { CS } from "@/lib/cs";

interface CSProcAvatarProps {
  seed?: string;
  size?: number;
  accent?: string;
  mono?: boolean;
  bg?: string;
}

// Procedural avatar derived from a hash of the user's handle. Two overlapping
// orthogonal squares, with one of four layout patterns selected by the hash.
export function CSProcAvatar({
  seed = "M",
  size = 44,
  accent,
  mono = false,
  bg,
}: CSProcAvatarProps) {
  const s = size;
  // FNV-ish 32-bit hash
  let h = 2166136261 >>> 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h =
      (h +
        ((h << 1) >>> 0) +
        ((h << 4) >>> 0) +
        ((h << 7) >>> 0) +
        ((h << 8) >>> 0) +
        ((h << 24) >>> 0)) >>>
      0;
  }
  const r = (k: number) => ((h >>> (k * 3)) & 0xff) / 255;
  const sq = s * (0.46 + r(0) * 0.1);
  const offA = s * (0.04 + r(1) * 0.06);
  const offB = s * (0.04 + r(2) * 0.06);
  const pat = Math.floor(r(3) * 4);
  let aX: number;
  let aY: number;
  let bX: number;
  let bY: number;
  switch (pat) {
    case 0:
      aX = offA;
      aY = offA;
      bX = s - sq - offB;
      bY = s - sq - offB;
      break;
    case 1:
      aX = offA;
      aY = s - sq - offA;
      bX = s - sq - offB;
      bY = offB;
      break;
    case 2:
      aX = (s - sq) / 2;
      aY = offA;
      bX = (s - sq) / 2;
      bY = s - sq - offB;
      break;
    case 3:
      aX = offA;
      aY = (s - sq) / 2;
      bX = s - sq - offB;
      bY = (s - sq) / 2;
      break;
    default:
      aX = offA;
      aY = offA;
      bX = s - sq - offB;
      bY = s - sq - offB;
  }
  const oX = Math.max(aX, bX);
  const oY = Math.max(aY, bY);
  const oW = Math.min(aX + sq, bX + sq) - oX;
  const oH = Math.min(aY + sq, bY + sq) - oY;
  const I = CS.ink;
  const A = mono ? CS.ink : accent || CS.violet;
  const BG = bg || CS.paper3;
  const stroke = Math.max(1.2, s * 0.04);
  return (
    <div
      style={{
        width: s,
        height: s,
        background: BG,
        borderRadius: s * 0.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        overflow: "hidden",
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
        {oW > 0 && oH > 0 ? (
          <rect x={oX} y={oY} width={oW} height={oH} fill={A} />
        ) : null}
        <rect
          x={aX}
          y={aY}
          width={sq}
          height={sq}
          fill="none"
          stroke={I}
          strokeWidth={stroke}
        />
        <rect
          x={bX}
          y={bY}
          width={sq}
          height={sq}
          fill="none"
          stroke={I}
          strokeWidth={stroke}
        />
      </svg>
    </div>
  );
}
