export default function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 12%, var(--scrim) 0%, transparent 70%)",
      }}
    />
  );
}
