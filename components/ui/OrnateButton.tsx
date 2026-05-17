"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ButtonOrnament from "./ButtonOrnament";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrnateButtonProps {
  variant: "primary" | "ghost";
  onClick: () => void;
  loading?: boolean;
  children: ReactNode;
}

export default function OrnateButton({ variant, onClick, loading = false, children }: OrnateButtonProps) {
  const { ready } = useSceneState();
  const reduce = useReducedMotion();
  const isPrimary = variant === "primary";
  const showGlow = isPrimary && ready;

  return (
    <div className="relative inline-block">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "var(--radius-sm)",
          boxShadow: "0 0 24px 4px var(--gold-primary)",
        }}
        initial={false}
        animate={{ opacity: showGlow ? 0.7 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <button
        type="button"
        data-variant={variant}
        disabled={loading}
        onClick={onClick}
        className="ornate-button relative inline-flex items-center justify-center active:scale-[0.97] disabled:opacity-60"
        style={{
          minHeight: 52,
          padding: "10px 56px",
          minWidth: 220,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--gold-stroke)",
          background: isPrimary
            ? "linear-gradient(180deg, var(--cta-green-top), var(--cta-green-bottom))"
            : "linear-gradient(180deg, var(--cta-amber-top), var(--cta-amber-bottom))",
          color: isPrimary ? "var(--cta-green-text)" : "var(--cta-amber-text)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.4)",
          fontWeight: 600,
          fontFamily: "inherit",
          fontSize: "1rem",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -22,
            top: -36,
            transform: "scaleY(-1)",
            display: "inline-flex",
            filter: "drop-shadow(0 0 1px rgba(230,212,163,0.5))",
          }}
        >
          <ButtonOrnament />
        </span>
        <span>{children}</span>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -22,
            bottom: -36,
            transform: "scaleX(-1)",
            display: "inline-flex",
            filter: "drop-shadow(0 0 1px rgba(230,212,163,0.5))",
          }}
        >
          <ButtonOrnament />
        </span>
      </button>
    </div>
  );
}
