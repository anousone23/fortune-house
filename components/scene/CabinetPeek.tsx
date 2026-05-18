"use client";

// Cabinet peeking door — left cabinet only.
//
// Layering (z within component):
//   1. dark backdrop (rectangle, same footprint as panel) — what shows in
//      the wedge when the panel rotates open
//   2. panel overlay (cabinet-panel-left.png cropped from bg.png) — sits
//      pixel-aligned over the painted panel; rotates -15deg on outer-edge
//      hinge to reveal a sliver of the backdrop
//
// Positioning: the outer bg-aspect-cover wrapper mirrors bg.png's
// object-fit:cover rectangle, so percentage-positioned children pin to the
// bg image, not the viewport. Mirror of Owl.tsx pattern.
//
// Mobile (<=640px): the whole component is display:none via .cabinet-peek
// in app/globals.css (matches .owl-mount precedent — scaled mobile bg
// doesn't have a matching slot for the painted panel).
//
// Phase ref + async controls pattern mirrors RatEyes.tsx.

import { useEffect, useRef } from "react";
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

const RANDOM_MIN_MS = 20_000;
const RANDOM_MAX_MS = 60_000;

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

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      const delay =
        RANDOM_MIN_MS + Math.random() * (RANDOM_MAX_MS - RANDOM_MIN_MS);
      timer = setTimeout(async () => {
        if (cancelled) return;
        try {
          await peek();
        } catch {
          // controls.start rejects on unmount during animation — ignore
        }
        if (!cancelled) schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // peek is stable (closure over useAnimationControls + ref) — intentional
    // empty deps so the effect runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Dark backdrop — sits exactly under the panel */}
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
      {/* Panel overlay — pixel-aligned with painted panel; rotates on hinge */}
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
