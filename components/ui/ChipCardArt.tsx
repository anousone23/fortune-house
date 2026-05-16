import Image from "next/image";

interface ChipCardArtProps {
  sigilId: string; // e.g., "love" → loads /scene/sigils/love.svg
}

export default function ChipCardArt({ sigilId }: ChipCardArtProps) {
  return (
    <div
      aria-hidden="true"
      className="chip-card-art pointer-events-none absolute inset-0"
      style={{
        background: "var(--ink-velvet)",
        border: "1px solid var(--gold-stroke)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}
    >
      {/* inner double-border */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          border: "0.5px solid var(--gold-dim)",
          borderRadius: "calc(var(--radius-sm) - 2px)",
          opacity: 0.6,
        }}
      />
      {/* sigil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gold-primary)",
        }}
      >
        <Image
          src={`/scene/sigils/${sigilId}.svg`}
          alt=""
          width={32}
          height={32}
          style={{ width: "60%", height: "auto", opacity: 0.85 }}
        />
      </div>
    </div>
  );
}
