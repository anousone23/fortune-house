"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Tuning constants — each is a single-line knob.
const GLOW_SIZE = 56; // px diameter
const SPRING_CONFIG = { stiffness: 200, damping: 25 };
const FADE_DURATION_S = 0.2;

export default function CursorGlow() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const targetX = useMotionValue(-1000); // off-screen until first cursor event
  const targetY = useMotionValue(-1000);
  const smoothedX = useSpring(targetX, SPRING_CONFIG);
  const smoothedY = useSpring(targetY, SPRING_CONFIG);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      targetX.set(e.clientX);
      targetY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = (e: MouseEvent) => {
      targetX.set(e.clientX);
      targetY.set(e.clientY);
      setVisible(true);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [targetX, targetY, reduce]);

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-glow pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        marginLeft: -GLOW_SIZE / 2,
        marginTop: -GLOW_SIZE / 2,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(252, 240, 200, 0.85) 0%, rgba(230, 212, 163, 0.4) 35%, transparent 70%)",
        mixBlendMode: "screen",
        x: smoothedX,
        y: smoothedY,
        zIndex: 50,
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: FADE_DURATION_S } }}
    />
  );
}
