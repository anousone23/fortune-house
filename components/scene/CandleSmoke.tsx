interface CandleSmokeProps {
  seed: number;
  style: React.CSSProperties;
}

export default function CandleSmoke({ seed, style }: CandleSmokeProps) {
  // deterministic per-seed delay so SSR/CSR match
  const delay = ((seed * 1.37) % 4).toFixed(2);
  return (
    <div
      aria-hidden="true"
      className="candle-smoke"
      style={{ ...style, ["--smoke-delay" as string]: `${delay}s` }}
    />
  );
}
