import { CS } from "@/lib/cs";
import type { ArchetypeId } from "@/lib/archetypes";

interface BadgeMarkProps {
  id: ArchetypeId;
  size?: number;
  ink?: string;
  accent?: string;
}

// 8 unique marks, all composed from orthogonal squares so the whole set
// rhymes with the brand Intersect mark.
export function BadgeMark({ id, size = 80, ink, accent }: BadgeMarkProps) {
  const s = size;
  const I = ink || CS.ink;
  const A = accent || CS.violet;
  const sw = Math.max(1.5, s * 0.05);

  switch (id) {
    case "td": {
      const sq = s * 0.36;
      const y = (s - sq) / 2;
      const gap = s * 0.16;
      const totalW = sq * 3 - (sq - gap) * 2;
      const startX = (s - totalW) / 2;
      const cs1 = { x: startX, y };
      const cs2 = { x: startX + (sq - gap), y };
      const cs3 = { x: startX + 2 * (sq - gap), y };
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect
            x={cs2.x}
            y={y}
            width={cs1.x + sq - cs2.x}
            height={sq}
            fill={A}
            opacity={0.5}
          />
          <rect
            x={cs3.x}
            y={y}
            width={cs2.x + sq - cs3.x}
            height={sq}
            fill={A}
            opacity={0.5}
          />
          {[cs1, cs2, cs3].map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={sq}
              height={sq}
              fill="none"
              stroke={I}
              strokeWidth={sw}
            />
          ))}
        </svg>
      );
    }
    case "pr": {
      const sq = s * 0.4;
      const off = 0.1;
      const aX = s * off;
      const aY = s * (1 - off) - sq;
      const bX = s * (1 - off) - sq;
      const bY = s * off;
      const oX = Math.max(aX, bX);
      const oY = Math.max(aY, bY);
      const oW = Math.min(aX + sq, bX + sq) - oX;
      const oH = Math.min(aY + sq, bY + sq) - oY;
      return (
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
            strokeWidth={sw}
          />
          <rect
            x={bX}
            y={bY}
            width={sq}
            height={sq}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
        </svg>
      );
    }
    case "wp": {
      const sq = s * 0.42;
      const off = s * 0.1;
      const aX = off;
      const aY = off;
      const bX = s - sq - off;
      const bY = off;
      const oX = Math.max(aX, bX);
      const oW = Math.min(aX + sq, bX + sq) - oX;
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect x={oX} y={aY} width={oW} height={sq} fill={A} />
          <rect
            x={aX}
            y={aY}
            width={sq}
            height={sq}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <rect
            x={bX}
            y={bY}
            width={sq}
            height={sq}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <rect
            x={s * 0.18}
            y={s * 0.78}
            width={s * 0.64}
            height={s * 0.08}
            fill={I}
          />
        </svg>
      );
    }
    case "pp": {
      const sq = s * 0.3;
      const gap = s * 0.06;
      const total = sq * 2 + gap;
      const startX = (s - total) / 2;
      const startY = (s - total) / 2;
      const cells: Array<[number, number]> = [
        [startX, startY],
        [startX + sq + gap, startY],
        [startX, startY + sq + gap],
        [startX + sq + gap, startY + sq + gap],
      ];
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect x={cells[3][0]} y={cells[3][1]} width={sq} height={sq} fill={A} />
          {cells.map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={sq}
              height={sq}
              fill="none"
              stroke={I}
              strokeWidth={sw * 0.9}
            />
          ))}
        </svg>
      );
    }
    case "ec": {
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect
            x={s * 0.1}
            y={s * 0.1}
            width={s * 0.8}
            height={s * 0.8}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <rect
            x={s * 0.22}
            y={s * 0.22}
            width={s * 0.56}
            height={s * 0.56}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <rect
            x={s * 0.36}
            y={s * 0.36}
            width={s * 0.28}
            height={s * 0.28}
            fill={A}
          />
        </svg>
      );
    }
    case "mm": {
      const sq = s * 0.5;
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
            strokeWidth={sw}
          />
          <rect
            x={bX}
            y={bY}
            width={sq}
            height={sq}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <rect
            x={s * 0.46}
            y={s * 0.46}
            width={s * 0.08}
            height={s * 0.08}
            fill={I}
          />
        </svg>
      );
    }
    case "cc": {
      const cs = s * 0.16;
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect
            x={s * 0.18}
            y={s * 0.18}
            width={s * 0.64}
            height={s * 0.64}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          {(
            [
              [s * 0.06, s * 0.06],
              [s * 0.78, s * 0.06],
              [s * 0.06, s * 0.78],
              [s * 0.78, s * 0.78],
            ] as Array<[number, number]>
          ).map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={cs} height={cs} fill={A} />
          ))}
        </svg>
      );
    }
    case "cl": {
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
          <rect
            x={s * 0.16}
            y={s * 0.16}
            width={s * 0.68}
            height={s * 0.68}
            fill="none"
            stroke={I}
            strokeWidth={sw}
          />
          <line
            x1={s * 0.12}
            y1={s * 0.88}
            x2={s * 0.88}
            y2={s * 0.12}
            stroke={A}
            strokeWidth={sw * 1.1}
          />
        </svg>
      );
    }
  }
}
