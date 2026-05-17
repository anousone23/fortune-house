"use client";

// Two red glowing dots — a rat hiding in the dark, peeking from one corner.
// On hover or click, the eyes grow ("startled"), then instantly disappear and
// reappear at a slightly different position on the same shelf. Position
// persists for the rest of the session — every interaction toggles between
// the two spots. On reappear, the eyes start darkened and glow back to red
// via a CSS transition.

import { useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Side = "left" | "right";

// Wrapper top-left positions. Both spots are on the same shelf (same Y);
// "right" is just ~60px further right than "left" — the rat scoots a bit
// along the floor, doesn't cross the room.
const POSITIONS: Record<Side, { left: string; top: string }> = {
  left:  { left: "calc(9vw - 8px)",  top: "calc(94vh - 13px)" },
  right: { left: "calc(9vw + 52px)", top: "calc(94vh - 13px)" },
};

export default function RatEyes() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");
  const [side, setSide] = useState<Side>("left");
  const [dim, setDim] = useState(false);
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

    // While invisible, teleport AND mark the eyes as dim. CSS class swaps
    // before the user can see anything, so the transition below isn't
    // perceived as a flash.
    setSide((prev) => (prev === "left" ? "right" : "left"));
    if (!reduce) setDim(true);

    // Wait for React to commit the new position + dim class
    await new Promise((r) => setTimeout(r, 80));

    // Reappear at the new spot, scale back to idle
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0 },
    });

    if (!reduce) {
      // Two RAFs guarantee the dim state has been painted before we ask the
      // browser to transition away from it. Without this the browser may
      // collapse the class add+remove into a single layout pass and skip
      // the transition entirely.
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      setDim(false);
      // Let the 700ms CSS transition complete before unlocking re-trigger
      await new Promise((r) => setTimeout(r, 750));
    }

    phaseRef.current = "idle";
  };

  const pos = POSITIONS[side];
  const eyeClass = dim ? "rat-eye is-dark" : "rat-eye";

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
          className={eyeClass}
          style={{
            left: 8,
            top: 13,
            animation: "eye-blink 4s linear infinite 0s",
          }}
        />
        <span
          className={eyeClass}
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
