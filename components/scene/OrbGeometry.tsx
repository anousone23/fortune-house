"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useSceneEnergy, useSceneState } from "@/app/SceneStateContext";

export default function OrbGeometry() {
  const energy = useSceneEnergy();
  const { ready } = useSceneState();

  // energy 0 → 0.3, 0.4 → 0.55, 0.7 → 0.75, 1.0 → 0.85
  const opacityFromEnergy = useTransform(energy, [0, 0.4, 0.7, 1], [0.3, 0.55, 0.75, 0.85]);

  return (
    <motion.div
      aria-hidden="true"
      className="orb-geometry pointer-events-none absolute inset-0"
      style={{
        color: "var(--gold-primary)",
        mixBlendMode: "screen",
        opacity: ready ? 0.95 : opacityFromEnergy,
        animation: "orb-rotate 60s linear infinite",
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image
        src="/scene/orb-geometry.svg"
        alt=""
        fill
        sizes="(max-width: 640px) 30vw, 18vw"
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  );
}
