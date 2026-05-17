"use client";

// Two red glowing dots — a rat hiding in the dark, peeking from one corner.
// On hover or click, the eyes grow ("startled"), then instantly disappear and
// reappear on the opposite side of the scene. Side persists for the rest of
// the session — every interaction just toggles between left and right.

import { useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Side = "left" | "right";

// Wrapper top-left positions for each side. The wrapper is 32x32; eyes inside
// are at x: 8 and 20, y: 13. Right side is the mirror of the left.
const POSITIONS: Record<Side, { left: string; top: string }> = {
  left: { left: "calc(9vw - 8px)", top: "calc(94vh - 13px)" },
  right: { left: "calc(91vw - 24px)", top: "calc(94vh - 13px)" },
};

export default function RatEyes() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");
  const [side, setSide] = useState<Side>("left");
  const reduce = useReducedMotion();

  const handleStartle = async () => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "active";

    if (!reduce) {
      // Grow + hold the "startled" pose
      await controls.start({
        scale: [1, 1.7, 1.7],
        transition: { duration: 0.4, times: [0, 0.5, 1] },
      });
    }

    // Instant disappear (no fade)
    await controls.start({ opacity: 0, transition: { duration: 0 } });

    // Teleport to the opposite side
    setSide((prev) => (prev === "left" ? "right" : "left"));

    // Wait for React to commit the new position before reappearing
    await new Promise((r) => setTimeout(r, 80));

    // Reappear at the new side, but darkened — the rat just opened its eyes
    // in shadow. Scale snaps back to idle, opacity is instant.
    await controls.start({
      opacity: 1,
      scale: 1,
      filter: "brightness(0.3) saturate(0.6)",
      transition: { duration: 0 },
    });

    // Glow up to the original red over ~700ms (instant under reduced-motion).
    await controls.start({
      filter: "brightness(1) saturate(1)",
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    });

    phaseRef.current = "idle";
  };

  const pos = POSITIONS[side];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 5 }}
    >
      <motion.div
        onMouseEnter={handleStartle}
        onClick={handleStartle}
        animate={controls}
        style={{
          position: "absolute",
          left: pos.left,
          top: pos.top,
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
