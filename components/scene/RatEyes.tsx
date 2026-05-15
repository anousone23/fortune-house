// Two red glowing dots under the right cabinet — a rat hiding in the dark.
// Each eye uses a different blink-cycle duration + delay so they don't sync.

export default function RatEyes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 5 }}
    >
      <span
        className="rat-eye"
        style={{
          left: "9vw",
          top: "92vh",
          animation: "eye-blink 4s linear infinite 0s",
        }}
      />
      <span
        className="rat-eye"
        style={{
          left: "calc(9vw + 12px)",
          top: "92vh",
          animation: "eye-blink 4.7s linear infinite 1.2s",
        }}
      />
    </div>
  );
}
