"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Petal {
  id: number;
  startX: number;
  drift: [number, number, number];
  rotation: number;
  duration: number;
}

let nextPetalId = 1;
function makePetal(viewportWidth: number): Petal {
  return {
    id: nextPetalId++,
    startX: Math.random() * viewportWidth,
    drift: [
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
    ],
    rotation: (Math.random() * 2 - 1) * 540,
    duration: 7 + Math.random() * 4,
  };
}

export default function FallingPetals() {
  const reduce = useReducedMotion();
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (reduce) return;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const spawn = () => {
      setPetals((prev) => [...prev, makePetal(window.innerWidth)]);
      timerId = setTimeout(spawn, 6000 + Math.random() * 4000);
    };
    timerId = setTimeout(spawn, 1000);
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 4 }}
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal-falling"
          style={
            {
              "--petal-start-x": `${p.startX}px`,
              "--petal-d1": `${p.drift[0]}px`,
              "--petal-d2": `${p.drift[1]}px`,
              "--petal-d3": `${p.drift[2]}px`,
              "--petal-rot": `${p.rotation}deg`,
              "--petal-duration": `${p.duration}s`,
            } as React.CSSProperties
          }
          onAnimationEnd={() =>
            setPetals((prev) => prev.filter((x) => x.id !== p.id))
          }
        >
          <Image
            src="/scene/petal.png"
            alt=""
            width={28}
            height={36}
            style={{ display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}
