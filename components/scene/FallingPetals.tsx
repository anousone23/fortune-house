"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSceneState } from "@/app/SceneStateContext";

interface Petal {
  id: number;
  startX: number;
  drift: [number, number, number];
  rotation: number;
  duration: number;
}

let nextPetalId = 1;
function makePetal(viewportWidth: number, slow: boolean): Petal {
  const baseDuration = 7 + Math.random() * 4;
  return {
    id: nextPetalId++,
    startX: Math.random() * viewportWidth,
    drift: [
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
    ],
    rotation: (Math.random() * 2 - 1) * 540,
    duration: slow ? baseDuration * 3.5 : baseDuration,
  };
}

export default function FallingPetals() {
  const reduce = useReducedMotion();
  const [petals, setPetals] = useState<Petal[]>([]);
  const { state } = useSceneState();
  const slow = state.focused;
  const slowRef = useRef(slow);
  slowRef.current = slow;

  useEffect(() => {
    if (reduce) return;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const spawn = () => {
      setPetals((prev) => [...prev, makePetal(window.innerWidth, slowRef.current)]);
      timerId = setTimeout(spawn, 6000 + Math.random() * 4000);
    };
    timerId = setTimeout(spawn, 1000);
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [reduce]);

  // Spawn an immediate "slow" petal when the textarea is focused, so the
  // slowdown is visible without waiting for the next regular spawn (6–10s).
  useEffect(() => {
    if (reduce || !state.focused) return;
    const id = setTimeout(() => {
      setPetals((prev) => [...prev, makePetal(window.innerWidth, true)]);
    }, 400);
    return () => clearTimeout(id);
  }, [state.focused, reduce]);

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
