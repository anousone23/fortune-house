"use client";

import { useRef } from "react";
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
  const innerRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <button
      ref={(el) => {
        innerRef.current = el;
        chipRef?.(el);
      }}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={() => setHoveredChip(id)}
      onMouseLeave={() => setHoveredChip(null)}
      onMouseMove={handleMouseMove}
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
