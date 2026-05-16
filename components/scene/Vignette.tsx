"use client";

import { motion } from "framer-motion";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Vignette() {
  const { state } = useSceneState();
  const reduce = useReducedMotion();
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="scene-vignette pointer-events-none absolute inset-0"
        animate={{ "--vignette-inner": state.focused ? "38%" : "60%" } as { [key: string]: string }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="scene-dim pointer-events-none absolute inset-0"
        animate={{ opacity: state.focused ? 0.35 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
