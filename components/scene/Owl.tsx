"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The OUTER wrapper below mimics the bg image's object-fit:cover transform,
// so its rectangle matches the bg image's rendered area pixel-for-pixel —
// regardless of viewport size. A child placed at "X%, Y%" of the outer wrapper
// is then pinned to that exact point on the bg image as the viewport changes.
// `--bg-aspect` is defined in tokens.css so all bg-anchored elements share one
// source of truth — if the bg image is swapped, update the token, not this file.

// Owl position as a percentage of the BG IMAGE (not the viewport).
// 0% = top/left of the image, 100% = bottom/right.
// Currently anchored to the top of the wooden perch added via OwlPerch.tsx —
// tune in the browser if it doesn't land squarely on the perch's flat top.
const OWL_X_PCT = "89%";
const OWL_Y_PCT = "47%";
const OWL_WIDTH = 140;
const OWL_HEIGHT = 160;
const HEAD_TOP = "5%";
const HEAD_LEFT = "24%";
const HEAD_WIDTH_PCT = "60%";

// Cursor-follow tuning constants (single-line tuning knobs).
const MAX_YAW = 25; // degrees — head's rotation limit
const REFERENCE_DISTANCE_PX = 400; // cursor distance at which yaw saturates
const IDLE_TIMEOUT_MS = 1500; // ms of no mousemove → head returns to neutral
const SPRING_CONFIG = { stiffness: 120, damping: 22 };

export default function Owl() {
  const reduce = useReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const headCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const targetYaw = useMotionValue(0);
  const smoothedYaw = useSpring(targetYaw, SPRING_CONFIG);
  // The head's body wrapper has scaleX(-1) — rotation inside a horizontally
  // flipped frame is visually inverted, so we negate before applying.
  const displayYaw = useTransform(smoothedYaw, (v) => -v);

  // Cache the head's viewport center on mount + on every resize. Reads from
  // the actual rendered head element via ref so it accounts for the bg-cover
  // wrapper, the position transform, and the scaleX(-1) flip.
  useEffect(() => {
    const measure = () => {
      if (!headRef.current) return;
      const r = headRef.current.getBoundingClientRect();
      headCenterRef.current = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Cursor → target yaw, with idle-timer recovery.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - headCenterRef.current.x;
      const raw = (dx / REFERENCE_DISTANCE_PX) * MAX_YAW;
      const clamped = Math.max(-MAX_YAW, Math.min(MAX_YAW, raw));
      targetYaw.set(clamped);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        targetYaw.set(0);
      }, IDLE_TIMEOUT_MS);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [targetYaw, reduce]);

  return (
    <div
      aria-hidden="true"
      className="owl-mount pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "max(100vw, calc(100dvh * var(--bg-aspect)))",
        height: "max(100dvh, calc(100vw / var(--bg-aspect)))",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: OWL_X_PCT,
          top: OWL_Y_PCT,
          width: OWL_WIDTH,
          height: OWL_HEIGHT,
          transform: "translate(-50%, -100%)",
          rotate: "-6deg",
          filter:
            "brightness(0.5) sepia(0.22) hue-rotate(-8deg) contrast(1.05) drop-shadow(3px 4px 8px rgba(0, 0, 0, 0.75))",
        }}
      >
        {/* Inner wrapper flips the visual horizontally so the owl faces left. */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: "scaleX(-1)",
          }}
        >
          <Image
            src="/scene/owl-body.png"
            alt=""
            width={OWL_WIDTH}
            height={OWL_HEIGHT}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
            }}
          />
          <motion.div
            ref={headRef}
            className="owl-head"
            style={{
              position: "absolute",
              top: HEAD_TOP,
              left: HEAD_LEFT,
              width: HEAD_WIDTH_PCT,
              rotate: displayYaw,
            }}
          >
            <Image
              src="/scene/owl-head.png"
              alt=""
              width={60}
              height={80}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
