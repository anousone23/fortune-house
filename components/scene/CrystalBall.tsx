"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import OrbGeometry from "./OrbGeometry";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CrystalBall() {
  const { state } = useSceneState();
  const reduce = useReducedMotion();
  const orbControls = useAnimationControls();
  const shockControls = useAnimationControls();

  useEffect(() => {
    if (reduce) return;
    if (!state.ritualActive) {
      orbControls.set({ scale: 1, filter: "brightness(1) saturate(1)" });
      shockControls.set({ opacity: 0, scale: 0 });
      return;
    }
    orbControls.start({
      scale: [1, 1.02, 1.04, 1.06, 1.06, 1, 1],
      filter: [
        "brightness(1) saturate(1)",
        "brightness(1.15) saturate(1.1)",
        "brightness(1.4) saturate(1.2)",
        "brightness(1.7) saturate(1.3)",
        "brightness(1.7) saturate(1.3)",
        "brightness(1) saturate(1)",
        "brightness(1) saturate(1)",
      ],
      transition: {
        duration: 2.8,
        times: [0, 0.143, 0.5, 0.571, 0.679, 0.821, 1],
        ease: "easeInOut",
      },
    });
    shockControls.start({
      opacity: [0, 0, 0, 1, 0],
      scale: [0, 0, 0, 0.6, 3],
      transition: {
        duration: 2.8,
        times: [0, 0.5, 0.535, 0.6, 0.714],
        ease: "easeOut",
      },
    });
  }, [state.ritualActive, reduce, orbControls, shockControls]);

  return (
    <div
      aria-hidden="true"
      className="crystal-ball pointer-events-none absolute"
      style={{
        left: "var(--orb-x)",
        top: "var(--orb-y)",
        transform: "translate(-50%, -72%)",
        aspectRatio: "1 / 1",
      }}
    >
      <motion.div
        animate={orbControls}
        initial={false}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Image
          src="/scene/orb.png"
          alt=""
          width={760}
          height={760}
          sizes="(max-width: 640px) 42vw, 24vw"
          priority
          style={{ width: "100%", height: "auto", position: "relative" }}
        />
        <OrbGeometry />
      </motion.div>
      <motion.div
        animate={shockControls}
        initial={{ opacity: 0, scale: 0 }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-mystic) 0%, var(--gold-primary) 40%, transparent 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
