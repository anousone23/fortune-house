"use client";

import { motion } from "framer-motion";
import ChipCardArt from "./ChipCardArt";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TopicChipProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  fanAngle?: number;
  chipRef?: (el: HTMLButtonElement | null) => void;
}

export default function TopicChip({ id, label, selected, onClick, fanAngle = 0, chipRef }: TopicChipProps) {
  const { setHoveredChip } = useSceneState();
  const reduce = useReducedMotion();

  return (
    <button
      ref={chipRef}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={() => setHoveredChip(id)}
      onMouseLeave={() => setHoveredChip(null)}
      onFocus={() => setHoveredChip(id)}
      onBlur={() => setHoveredChip(null)}
      className="topic-chip inline-flex items-center justify-center rounded-full"
      style={{
        minHeight: 44,
        padding: "8px 18px",
        background: selected ? "var(--gold-primary)" : "rgba(26, 5, 8, 0.65)",
        color: selected ? "var(--ink-velvet-deep)" : "var(--text-primary)",
        border: "1px solid var(--gold-stroke)",
        fontWeight: selected ? 600 : 500,
        fontFamily: "inherit",
        fontSize: "0.95rem",
        whiteSpace: "nowrap",
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.div
        className="topic-chip-card"
        style={{ ["--chip-fan-angle" as string]: `${fanAngle}deg` }}
        initial={false}
        animate={selected ? { y: -3, rotate: 0 } : { y: 0, rotate: fanAngle }}
        whileHover={reduce ? undefined : { y: -6, rotate: 0 }}
        whileTap={reduce ? undefined : { rotate: -2 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }}
      >
        <ChipCardArt sigilId={id} />
      </motion.div>
      {label}
    </button>
  );
}
