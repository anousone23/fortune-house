"use client";

import { motion } from "framer-motion";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function OrbGeometry() {
  const { tintColor } = useSceneState();
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="orb-tint pointer-events-none absolute inset-0"
      style={{
        mixBlendMode: "screen",
        borderRadius: "50%",
        background: tintColor
          ? `radial-gradient(circle, ${tintColor} 0%, transparent 60%)`
          : "transparent",
      }}
      animate={{ opacity: tintColor ? 0.25 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
