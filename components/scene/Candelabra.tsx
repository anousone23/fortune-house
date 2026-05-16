import Image from "next/image";
import CandleFlame from "./CandleFlame";

interface CandelabraProps {
  position: "left" | "right";
}

const WICKS = [
  { xPct: 20, yPct: 18 }, // left arm (shorter)
  { xPct: 52, yPct: 10 }, // center arm (taller)
  { xPct: 83, yPct: 18 }, // right arm (shorter)
] as const;

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
        sizes="(max-width: 640px) 0px, 18vw"
        style={{ objectFit: "contain" }}
      />
      {WICKS.map((wick, i) => (
        <CandleFlame
          key={`flame-${i}`}
          seed={position === "left" ? i : i + 3}
          style={{
            left: `${wick.xPct}%`,
            top: `${wick.yPct}%`,
            transform: "translate(-50%, -100%)",
          }}
        />
      ))}
    </div>
  );
}
