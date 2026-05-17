"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Tuning constants — each is a single-line knob.
const MAX_DRIFT_PX = 40; // how far the glow can drift from orb center
const REFERENCE_DISTANCE_PX = 350; // cursor distance at which drift saturates
const IDLE_TIMEOUT_MS = 1500; // ms of no mousemove → glow returns to center
const SPRING_CONFIG = { stiffness: 80, damping: 18 };

export default function OrbGlow() {
  const reduce = useReducedMotion();
  const orbRef = useRef<HTMLDivElement>(null);
  const orbCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const smoothedX = useSpring(targetX, SPRING_CONFIG);
  const smoothedY = useSpring(targetY, SPRING_CONFIG);

  // Cache the glow's viewport center on mount + on every resize.
  useEffect(() => {
    const measure = () => {
      if (!orbRef.current) return;
      const r = orbRef.current.getBoundingClientRect();
      orbCenterRef.current = {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Cursor → target drift, with idle-timer recovery.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - orbCenterRef.current.x;
      const dy = e.clientY - orbCenterRef.current.y;
      const rawX = (dx / REFERENCE_DISTANCE_PX) * MAX_DRIFT_PX;
      const rawY = (dy / REFERENCE_DISTANCE_PX) * MAX_DRIFT_PX;
      const x = Math.max(-MAX_DRIFT_PX, Math.min(MAX_DRIFT_PX, rawX));
      const y = Math.max(-MAX_DRIFT_PX, Math.min(MAX_DRIFT_PX, rawY));
      targetX.set(x);
      targetY.set(y);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        targetX.set(0);
        targetY.set(0);
      }, IDLE_TIMEOUT_MS);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [targetX, targetY, reduce]);

  return (
    <motion.div
      ref={orbRef}
      aria-hidden="true"
      className="orb-glow pointer-events-none"
      style={{
        position: "absolute",
        left: "20%",
        top: "20%",
        width: "60%",
        height: "60%",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(252, 240, 200, 0.7) 0%, rgba(230, 212, 163, 0.35) 35%, transparent 65%)",
        mixBlendMode: "screen",
        x: smoothedX,
        y: smoothedY,
      }}
    />
  );
}
