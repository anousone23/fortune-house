"use client";

// Two red glowing dots — a rat hiding in the dark, peeking from one corner.
// On hover or click: eyes grow ("startled") → slowly fade to opacity 0 →
// teleport to the other spot on the same shelf → slowly fade back to full
// opacity. Position persists for the rest of the session; each interaction
// toggles between the two spots.

import { useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function RatEyes() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");
  const reduce = useReducedMotion();

  const handleStartle = async () => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "active";

    try {
      if (!reduce) {
        // 1. Grow + hold the "startled" pose
        await controls.start({
          scale: [1, 1.7, 1.7],
          transition: { duration: 0.4, times: [0, 0.5, 1] },
        });
        // 2. Slowly fade to invisible (eye color "shrinks" via opacity)
        await controls.start({
          opacity: 0,
          transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
        });
      } else {
        // Reduced motion: brief fade rather than grow
        await controls.start({
          opacity: 0,
          transition: { duration: 0.2 },
        });
      }

      // 3. Wait briefly while invisible before fading back in
      await new Promise((r) => setTimeout(r, 80));

      // 4. Slowly fade back in, scale back to idle
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: reduce
          ? { duration: 0.2 }
          : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });
    } finally {
      // Always reset, even if something above throws
      phaseRef.current = "idle";
    }
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      // z-index 15 sits above the form container (z-10). The new right
      // position lands inside the form's bounding box on smaller viewports;
      // without raising the rat above the form, the form's bbox captures
      // hovers before they reach the rat.
      style={{ zIndex: 15 }}
    >
      <motion.div
        onMouseEnter={handleStartle}
        onClick={handleStartle}
        animate={controls}
        style={{
          position: "absolute",
          left: "var(--rat-x)",
          top: "var(--rat-y)",
          width: 32,
          height: 32,
          pointerEvents: "auto",
          cursor: "default",
        }}
      >
        <span
          className="rat-eye"
          style={{
            left: 8,
            top: 13,
            animation: "eye-blink 4s linear infinite 0s",
          }}
        />
        <span
          className="rat-eye"
          style={{
            left: 20,
            top: 13,
            animation: "eye-blink 4.7s linear infinite 1.2s",
          }}
        />
      </motion.div>
    </div>
  );
}
