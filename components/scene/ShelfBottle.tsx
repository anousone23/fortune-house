"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSceneState } from "@/app/SceneStateContext";

type Variant = 1 | 2 | 3 | 4 | 5 | 6;
type Side = "left" | "right";
type Slot = 0 | 1 | 2 | 3 | 4 | 5;
type Props = { variant: Variant; side: Side; slot: Slot };

const BOTTLE_SRC: Record<Variant, string> = {
  1: "/scene/bottle-1.png",
  2: "/scene/bottle-2.png",
  3: "/scene/bottle-3.png",
  4: "/scene/bottle-4.png",
  5: "/scene/bottle-5.png",
  6: "/scene/bottle-6.png",
};

const SLOW_RATE = 0.55;

export default function ShelfBottle({ variant, side, slot }: Props) {
  const reduce = useReducedMotion();
  const { state } = useSceneState();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rate = state.focused ? SLOW_RATE : 1;
    const apply = () => {
      el.getAnimations({ subtree: true }).forEach((a) => {
        a.playbackRate = rate;
      });
    };
    apply();
    const raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [state.focused, reduce]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="shelf-bottle pointer-events-none"
      data-side={side}
      data-slot={slot}
      data-variant={variant}
    >
      <Image
        src={BOTTLE_SRC[variant]}
        alt=""
        width={120}
        height={240}
        sizes="(max-width: 640px) 6vw, 5vw"
        priority={false}
      />
    </div>
  );
}
