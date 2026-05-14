const ROTATIONS = [
  { rotate: 0,   position: { top: 6, left: 6 } },
  { rotate: 90,  position: { top: 6, right: 6 } },
  { rotate: 180, position: { bottom: 6, right: 6 } },
  { rotate: 270, position: { bottom: 6, left: 6 } },
] as const;

function CornerGlyph() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M 2 14 L 2 2 L 14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 6 14 L 6 6 L 14 6" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <path d="M 14 6 Q 18 6 18 10 Q 18 14 22 14" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M 2 2 L 5 5 M 5 2 L 2 5" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
    </svg>
  );
}

export default function FrameCorners() {
  return (
    <>
      {ROTATIONS.map(({ rotate, position }, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ ...position, transform: `rotate(${rotate}deg)`, color: "var(--gold-stroke)" }}
        >
          <CornerGlyph />
        </span>
      ))}
    </>
  );
}
