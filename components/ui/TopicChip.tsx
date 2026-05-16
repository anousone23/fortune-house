"use client";

import { motion } from "framer-motion";
import ChipCardArt from "./ChipCardArt";
import { useSceneState } from "@/app/SceneStateContext";

interface TopicChipProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  fanAngle?: number;
}

export default function TopicChip({ id, label, selected, onClick, fanAngle = 0 }: TopicChipProps) {
  const { setHoveredChip } = useSceneState();

  return (
    <button
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
        whileHover={{ y: -6, rotate: 0 }}
        whileTap={{ rotate: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        <ChipCardArt sigilId={id} />
      </motion.div>
      {label}
    </button>
  );
}
