"use client";

import { useSceneState } from "@/app/SceneStateContext";

interface TopicChipProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  chipRef?: (el: HTMLButtonElement | null) => void;
}

export default function TopicChip({ id, label, selected, onClick, chipRef }: TopicChipProps) {
  const { setHoveredChip } = useSceneState();

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
      className="topic-chip inline-flex items-center justify-center"
      style={{
        minHeight: 44,
        padding: "8px 18px",
        borderRadius: "var(--radius-sm)",
        background: selected ? "var(--gold-primary)" : "rgba(26, 5, 8, 0.65)",
        color: selected ? "var(--ink-velvet-deep)" : "var(--text-primary)",
        border: "1px solid var(--gold-stroke)",
        fontWeight: selected ? 600 : 500,
        fontFamily: "inherit",
        fontSize: "0.95rem",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
