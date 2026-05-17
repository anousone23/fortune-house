"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface Spark {
  id: number;
  cornerX: number; // 0..1 — fractional position along the parent's width
  cornerY: number; // 0 or 1 — top or bottom edge of parent
}

interface KeystrokeSparksProps {
  sparks: Spark[];
}

export default function KeystrokeSparks({ sparks }: KeystrokeSparksProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ overflow: "visible" }}
    >
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.cornerX * 100}%`,
              top: `${s.cornerY * 100}%`,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--gold-primary)",
              boxShadow:
                "0 0 14px 2px var(--gold-primary), 0 0 28px var(--gold-stroke)",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 1, scale: 1.2, y: 0 }}
            animate={{ opacity: 0, scale: 0.4, y: -32 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
