"use client";

import { motion } from "framer-motion";
import { useSceneState } from "@/app/SceneStateContext";

export default function Vignette() {
  const { state } = useSceneState();
  return (
    <motion.div
      aria-hidden="true"
      className="scene-vignette pointer-events-none absolute inset-0"
      animate={{ "--vignette-inner": state.focused ? "45%" : "60%" } as { [key: string]: string }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
