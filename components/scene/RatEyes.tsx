"use client";
import { useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FLEE_DISTANCE_PX = 240;
const HIDE_DELAY_MS = 6000;

export default function RatEyes() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");
  const reduce = useReducedMotion();

  const handleStartle = async () => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "active";

    if (reduce) {
      await controls.start({ opacity: 0, transition: { duration: 0.2 } });
      await new Promise((r) => setTimeout(r, HIDE_DELAY_MS));
      await controls.start({ opacity: 1, transition: { duration: 0.2 } });
    } else {
      await controls.start({
        scale:   [1, 1.7, 1.7, 1.4, 1.4],
        x:       [0,   0,   0, FLEE_DISTANCE_PX, FLEE_DISTANCE_PX],
        opacity: [1,   1,   1,   1, 0],
        transition: { duration: 1.1, times: [0, 0.18, 0.35, 0.85, 1.0] },
      });
      await new Promise((r) => setTimeout(r, HIDE_DELAY_MS));
      await controls.start({
        scale: 1, x: 0, opacity: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });
    }

    phaseRef.current = "idle";
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 5 }}
    >
      <motion.div
        onMouseEnter={handleStartle}
        animate={controls}
        style={{
          position: "absolute",
          left: "calc(9vw - 8px)",
          top: "calc(94vh - 13px)",
          width: 32,
          height: 32,
          pointerEvents: "auto",
          cursor: "default",
        }}
      >
        <span
          className="rat-eye"
          style={{ left: 8,  top: 13, animation: "eye-blink 4s linear infinite 0s" }}
        />
        <span
          className="rat-eye"
          style={{ left: 20, top: 13, animation: "eye-blink 4.7s linear infinite 1.2s" }}
        />
      </motion.div>
    </div>
  );
}
