"use client";

// Two red glowing dots — a rat hiding in the dark, peeking from one corner.
// On desktop, hover/click triggers a startle: eyes grow, fade out, teleport
// to the other shelf spot, fade back in. Mobile is blink-only — position
// comes from the --rat-x / --rat-y CSS vars (bottom-right corner) and the
// interaction handlers are no-ops.

import { useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

type Side = "left" | "right";

// Wrapper top-left positions. Both spots are on the same shelf (same Y);
// "right" is just further right than "left" — the rat scoots a bit
// along the floor, doesn't cross the room.
const POSITIONS: Record<Side, { left: string; top: string }> = {
  left:  { left: "calc(9vw - 8px)",   top: "calc(94vh - 13px)" },
  right: { left: "calc(9vw + 200px)", top: "calc(94vh - 13px)" },
};

export default function RatEyes() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");
  const [side, setSide] = useState<Side>("left");
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  const handleStartle = async () => {
    if (isMobile) return;
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

      // 3. Teleport to the opposite shelf spot while invisible
      setSide((prev) => (prev === "left" ? "right" : "left"));

      // Wait for React to commit the new position
      await new Promise((r) => setTimeout(r, 80));

      // 4. Slowly fade in at the new spot, scale back to idle
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: reduce
          ? { duration: 0.2 }
          : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      });
    } finally {
      phaseRef.current = "idle";
    }
  };

  const pos = isMobile
    ? { left: "var(--rat-x)", top: "var(--rat-y)" }
    : POSITIONS[side];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 15 }}
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
          pointerEvents: isMobile ? "none" : "auto",
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
