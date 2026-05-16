"use client";

import { motion } from "framer-motion";

interface ChipWispProps {
  fromRect: { x: number; y: number };
  toRect: { x: number; y: number };
  themeColor: string;
}

export default function ChipWisp({ fromRect, toRect, themeColor }: ChipWispProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed"
      style={{
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${themeColor} 0%, var(--accent-mystic) 60%, transparent 100%)`,
        filter: "blur(2px)",
        mixBlendMode: "screen",
        zIndex: 5,
      }}
      initial={{ x: fromRect.x, y: fromRect.y, opacity: 0, scale: 0.6 }}
      animate={{
        x: [fromRect.x, toRect.x],
        y: [fromRect.y, toRect.y],
        opacity: [0, 0.8, 0],
        scale: [0.6, 1, 0.4],
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
