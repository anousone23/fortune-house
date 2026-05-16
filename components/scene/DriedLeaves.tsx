"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSceneState } from "@/app/SceneStateContext";

interface Leaf {
  id: number;
  startX: number;
  drift: [number, number, number];
  rotations: [number, number, number];
  duration: number;
}

let nextLeafId = 1;
function makeLeaf(viewportWidth: number, slow: boolean): Leaf {
  const sign = Math.random() < 0.5 ? -1 : 1;
  const baseDuration = 15 + Math.random() * 6;
  return {
    id: nextLeafId++,
    startX: Math.random() * viewportWidth,
    drift: [
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 140,
    ],
    rotations: [
      sign * (60 + Math.random() * 120),
      -sign * (60 + Math.random() * 120),
      sign * (60 + Math.random() * 120),
    ],
    duration: slow ? baseDuration * 2 : baseDuration,
  };
}

export default function DriedLeaves() {
  const reduce = useReducedMotion();
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const { state } = useSceneState();
  const slow = state.focused;
  const slowRef = useRef(slow);
  slowRef.current = slow;

  useEffect(() => {
    if (reduce) return;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const spawn = () => {
      setLeaves((prev) => [...prev, makeLeaf(window.innerWidth, slowRef.current)]);
      timerId = setTimeout(spawn, 10000 + Math.random() * 8000);
    };
    timerId = setTimeout(spawn, 2000);
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
      {leaves.map((l) => (
        <div
          key={l.id}
          className="leaf-falling"
          style={
            {
              "--leaf-start-x": `${l.startX}px`,
              "--leaf-d1": `${l.drift[0]}px`,
              "--leaf-d2": `${l.drift[1]}px`,
              "--leaf-d3": `${l.drift[2]}px`,
              "--leaf-r1": `${l.rotations[0]}deg`,
              "--leaf-r2": `${l.rotations[1]}deg`,
              "--leaf-r3": `${l.rotations[2]}deg`,
              "--leaf-duration": `${l.duration}s`,
            } as React.CSSProperties
          }
          onAnimationEnd={() =>
            setLeaves((prev) => prev.filter((x) => x.id !== l.id))
          }
        >
          <Image
            src="/scene/leaf.png"
            alt=""
            width={32}
            height={32}
            style={{ display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}
