interface Wick {
  xPct: number;
  yPct: number;
}

interface WaxDripsProps {
  wicks: readonly Wick[];
}

const DRIP_CONFIGS = [
  { duration: "7s", delay: "1s" },
  { duration: "6s", delay: "4s" },
  { duration: "8s", delay: "7s" },
] as const;

export default function WaxDrips({ wicks }: WaxDripsProps) {
  return (
    <>
      {wicks.map((wick, i) => {
        const config = DRIP_CONFIGS[i % DRIP_CONFIGS.length];
        return (
          <span
            key={`drip-${i}`}
            aria-hidden="true"
            className="wax-drip"
            style={{
              left: `${wick.xPct}%`,
              top: `${wick.yPct}%`,
              animation: `wax-drip-fall ${config.duration} ease-in infinite ${config.delay}`,
            }}
          />
        );
      })}
    </>
  );
}
