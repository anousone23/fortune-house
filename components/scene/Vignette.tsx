"use client";

import { motion } from "framer-motion";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Vignette() {
  const { state } = useSceneState();
  const reduce = useReducedMotion();
  const dimTarget = state.ritualActive ? 1 : state.focused ? 0.7 : 0;
  return (
    <>
      <div
        aria-hidden="true"
        className={`scene-vignette pointer-events-none absolute inset-0${state.ritualActive ? " is-ritual" : ""}`}
      />
      <motion.div
        aria-hidden="true"
        className="scene-dim pointer-events-none absolute inset-0"
        animate={{ opacity: dimTarget }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: state.ritualActive ? 0.4 : state.focused ? 1.6 : 0.8,
                ease: [0.4, 0, 0.6, 1],
              }
        }
      />
    </>
  );
}
