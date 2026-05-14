type Mote = {
  left: string;
  top: string;
  pattern: "drift-1" | "drift-2" | "drift-3" | "drift-4";
  duration: string;
  delay: string;
};

const MOTES: readonly Mote[] = [
  { left: "10%", top: "80%", pattern: "drift-1", duration: "14s", delay: "0s"   },
  { left: "18%", top: "75%", pattern: "drift-2", duration: "17s", delay: "2s"   },
  { left: "24%", top: "85%", pattern: "drift-3", duration: "12s", delay: "4s"   },
  { left: "30%", top: "70%", pattern: "drift-4", duration: "16s", delay: "1s"   },
  { left: "36%", top: "82%", pattern: "drift-1", duration: "13s", delay: "3s"   },
  { left: "42%", top: "76%", pattern: "drift-2", duration: "15s", delay: "5s"   },
  { left: "48%", top: "88%", pattern: "drift-3", duration: "18s", delay: "1.5s" },
  { left: "54%", top: "72%", pattern: "drift-4", duration: "14s", delay: "6s"   },
  { left: "60%", top: "80%", pattern: "drift-1", duration: "16s", delay: "4.5s" },
  { left: "66%", top: "78%", pattern: "drift-2", duration: "13s", delay: "2.5s" },
  { left: "72%", top: "84%", pattern: "drift-3", duration: "15s", delay: "0.5s" },
  { left: "80%", top: "76%", pattern: "drift-4", duration: "17s", delay: "3.5s" },
  { left: "86%", top: "82%", pattern: "drift-1", duration: "12s", delay: "5.5s" },
  { left: "14%", top: "60%", pattern: "drift-2", duration: "18s", delay: "7s"   },
  { left: "50%", top: "65%", pattern: "drift-3", duration: "14s", delay: "8s"   },
  { left: "76%", top: "62%", pattern: "drift-4", duration: "16s", delay: "6.5s" },
];

export default function DustMotes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 4 }}
    >
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="dust-mote"
          style={{
            left: m.left,
            top: m.top,
            animation: `${m.pattern} ${m.duration} ease-in-out infinite ${m.delay}`,
          }}
        />
      ))}
    </div>
  );
}
