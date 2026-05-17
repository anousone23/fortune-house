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
function makeLeaf(viewportWidth: number): Leaf {
  const sign = Math.random() < 0.5 ? -1 : 1;
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
    duration: 15 + Math.random() * 6,
  };
}

// Playback rate for the CSS animation while the textarea is focused.
// 1 = real-time, 0.3 = roughly 1/3 the normal falling speed.
const SLOW_RATE = 0.3;

export default function DriedLeaves() {
  const reduce = useReducedMotion();
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const { state } = useSceneState();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const spawn = () => {
      setLeaves((prev) => [...prev, makeLeaf(window.innerWidth)]);
      timerId = setTimeout(spawn, 10000 + Math.random() * 8000);
    };
    timerId = setTimeout(spawn, 2000);
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [reduce]);

  // Apply the current playbackRate to every running leaf animation.
  // Re-runs when focus toggles (slows/speeds existing leaves smoothly
  // mid-fall) and when leaves.length changes (so newly mounted leaves
  // start at the current speed).
  useEffect(() => {
    if (reduce) return;
    const container = containerRef.current;
    if (!container) return;
    const rate = state.ritualActive ? 0.15 : state.focused ? SLOW_RATE : 1;
    const apply = () => {
      container.querySelectorAll(".leaf-falling").forEach((el) => {
        el.getAnimations().forEach((a) => {
          a.playbackRate = rate;
        });
      });
    };
    apply();
    // Some browsers register CSS animations on the next frame after mount.
    const raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [state.focused, state.ritualActive, leaves.length, reduce]);

  return (
    <div
      ref={containerRef}
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
