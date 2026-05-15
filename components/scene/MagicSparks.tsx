const SPARKS = [
  { id: 0, left: "32%", variant: "warm",   keyframe: "spark-fall-a", duration: "9s",  delay: "0s"   },
  { id: 1, left: "42%", variant: "mystic", keyframe: "spark-fall-b", duration: "11s", delay: "1.5s" },
  { id: 2, left: "50%", variant: "warm",   keyframe: "spark-fall-c", duration: "8s",  delay: "3s"   },
  { id: 3, left: "58%", variant: "mystic", keyframe: "spark-fall-a", duration: "10s", delay: "4.5s" },
  { id: 4, left: "68%", variant: "warm",   keyframe: "spark-fall-b", duration: "9s",  delay: "6s"   },
  { id: 5, left: "38%", variant: "mystic", keyframe: "spark-fall-c", duration: "12s", delay: "2s"   },
  { id: 6, left: "53%", variant: "warm",   keyframe: "spark-fall-a", duration: "11s", delay: "5s"   },
  { id: 7, left: "63%", variant: "mystic", keyframe: "spark-fall-b", duration: "10s", delay: "7.5s" },
] as const;

export default function MagicSparks() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 4 }}
    >
      {SPARKS.map((s) => (
        <span
          key={s.id}
          className={`magic-spark magic-spark-${s.variant}`}
          style={{
            left: s.left,
            top: "-5%",
            animation: `${s.keyframe} ${s.duration} linear infinite ${s.delay}`,
          }}
        />
      ))}
    </div>
  );
}
