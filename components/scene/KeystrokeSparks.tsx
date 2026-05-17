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
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--gold-primary)",
              boxShadow: "0 0 8px var(--gold-primary)",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0.9, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 0.5, y: -18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
