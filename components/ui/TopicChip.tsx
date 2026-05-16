interface TopicChipProps {
  id?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TopicChip({ id: _id, label, selected, onClick }: TopicChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full transition-colors duration-200 ease-out"
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
      }}
    >
      {label}
    </button>
  );
}
