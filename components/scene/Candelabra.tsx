"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CandleFlame from "./CandleFlame";
import CandleSmoke from "./CandleSmoke";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CandelabraProps {
  position: "left" | "right";
}

const WICKS = [
  { xPct: 20, yPct: 18 },
  { xPct: 52, yPct: 10 },
  { xPct: 83, yPct: 18 },
] as const;

export default function Candelabra({ position }: CandelabraProps) {
  const { state } = useSceneState();
  const dim = state.focused;
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="candelabra pointer-events-none"
      data-side={position}
      animate={{ opacity: dim ? 0.7 : 1, filter: dim ? "brightness(0.8)" : "brightness(1)" }}
      transition={reduce ? { duration: 0 } : { duration: dim ? 0.4 : 0.6, ease: [0.16, 1, 0.3, 1] }}
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
      {WICKS.map((wick, i) => (
        <CandleSmoke
          key={`smoke-${i}`}
          seed={position === "left" ? i : i + 3}
          style={{
            left: `${wick.xPct}%`,
            top: `${wick.yPct}%`,
          }}
        />
      ))}
    </motion.div>
  );
}
