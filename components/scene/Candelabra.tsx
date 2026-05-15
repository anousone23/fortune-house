import Image from "next/image";
import CandleFlame from "./CandleFlame";
import CandleSmoke from "./CandleSmoke";

interface CandelabraProps {
  position: "left" | "right";
}

// Wick positions as a percentage of the candelabra PNG's bounding box.
// Eyeballed from the delivered public/scene/candelabra.png. Nudge after browser smoke if needed.
const WICKS = [
  { xPct: 18, yPct: 20 }, // left arm (shorter)
  { xPct: 50, yPct: 12 }, // center arm (taller)
  { xPct: 81, yPct: 20 }, // right arm (shorter)
] as const;

// Smoke emerges from above the flame tip, not at the wick base.
// Offset is applied as: smoke top = wick yPct + SMOKE_Y_OFFSET (negative → moves up).
const SMOKE_Y_OFFSET = -6;

export default function Candelabra({ position }: CandelabraProps) {
  return (
    <div
      aria-hidden="true"
      className="candelabra pointer-events-none"
      data-side={position}
    >
      <Image
        src="/scene/candelabra.png"
        alt=""
        fill
        preload
        sizes="(max-width: 640px) 0px, 18vw"
        style={{ objectFit: "contain" }}
      />
      {WICKS.map((wick, i) => (
        <CandleFlame
          key={`flame-${i}`}
          style={{
            left: `${wick.xPct}%`,
            top: `${wick.yPct}%`,
            transform: "translate(-50%, -100%)",
          }}
        />
      ))}
      {WICKS.map((wick, i) => (
        <CandleSmoke
          key={`smoke-${i}`}
          style={{
            left: `${wick.xPct}%`,
            top: `${wick.yPct + SMOKE_Y_OFFSET}%`,
            transform: "translate(-50%, -100%)",
          }}
        />
      ))}
    </div>
  );
}
