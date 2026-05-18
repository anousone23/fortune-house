"use client";

// Cabinet peeking door — left cabinet only.
// See docs/superpowers/specs/2026-05-18-cabinet-peeking-door-design.md
// Phase ref + async controls pattern mirrors RatEyes.tsx.

import { useRef } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";

const PANEL_LEFT = "9.5%";
const PANEL_TOP = "44%";
const PANEL_WIDTH = "7%";
const PANEL_HEIGHT = "26.5%";

const PEEK_ANGLE_DEG = -15;
const OPEN_MS = 350;
const HOLD_MS = 1200;
const CLOSE_MS = 500;

export default function CabinetPeek() {
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");

  const peek = async () => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "active";
    try {
      await controls.start({
        rotateY: PEEK_ANGLE_DEG,
        transition: { duration: OPEN_MS / 1000, ease: "easeOut" },
      });
      await new Promise((r) => setTimeout(r, HOLD_MS));
      await controls.start({
        rotateY: 0,
        transition: { duration: CLOSE_MS / 1000, ease: "easeIn" },
      });
    } finally {
      phaseRef.current = "idle";
    }
  };

  return (
    <div
      aria-hidden="true"
      className="cabinet-peek pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "max(100vw, calc(100dvh * var(--bg-aspect)))",
        height: "max(100dvh, calc(100vw / var(--bg-aspect)))",
        transform: "translate(-50%, -50%)",
        perspective: "1200px",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
          background: "#050203",
        }}
      />
      <motion.div
        onMouseEnter={peek}
        onClick={peek}
        animate={controls}
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
          transformOrigin: "0% 50%",
          pointerEvents: "auto",
          cursor: "default",
          willChange: "transform",
        }}
      >
        <Image
          src="/scene/cabinet-panel-left.png"
          alt=""
          fill
          sizes="20vw"
          style={{ objectFit: "cover", display: "block" }}
          priority={false}
        />
      </motion.div>
    </div>
  );
}
