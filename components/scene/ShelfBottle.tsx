"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
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

type Handler = () => void;
const subscribers = new Map<string, Handler>();
let schedulerTimer: ReturnType<typeof setTimeout> | null = null;
let schedulerFocused = false;

function pickAndFire() {
  const ids = Array.from(subscribers.keys());
  if (ids.length === 0) return;
  const id = ids[Math.floor(Math.random() * ids.length)];
  subscribers.get(id)?.();
}

function scheduleNext() {
  const [min, max] = schedulerFocused ? [6000, 10000] : [2000, 4000];
  const delay = min + Math.random() * (max - min);
  schedulerTimer = setTimeout(() => {
    pickAndFire();
    scheduleNext();
  }, delay);
}

function startScheduler() {
  if (schedulerTimer) return;
  scheduleNext();
}

function stopScheduler() {
  if (schedulerTimer) {
    clearTimeout(schedulerTimer);
    schedulerTimer = null;
  }
}

function setFocused(focused: boolean) {
  schedulerFocused = focused;
}

export default function ShelfBottle({ variant, side, slot }: Props) {
  const reduce = useReducedMotion();
  const { state } = useSceneState();
  const controls = useAnimationControls();
  const phaseRef = useRef<"idle" | "active">("idle");

  const handleWobble = useCallback(async () => {
    if (reduce || phaseRef.current !== "idle") return;
    phaseRef.current = "active";
    try {
      await controls.start({
        rotate: [0, -3, 2, -2, 1, 0],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.2, 0.45, 0.7, 0.88, 1],
        },
      });
    } finally {
      phaseRef.current = "idle";
    }
  }, [controls, reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = `${side}-${slot}`;
    subscribers.set(id, handleWobble);
    startScheduler();
    return () => {
      subscribers.delete(id);
      if (subscribers.size === 0) stopScheduler();
    };
  }, [side, slot, handleWobble, reduce]);

  useEffect(() => {
    if (reduce) return;
    setFocused(state.focused || state.ritualActive);
  }, [state.focused, state.ritualActive, reduce]);

  return (
    <motion.div
      aria-hidden="true"
      className="shelf-bottle"
      data-side={side}
      data-slot={slot}
      data-variant={variant}
      animate={controls}
      onMouseEnter={handleWobble}
      onClick={handleWobble}
    >
      <Image
        src={BOTTLE_SRC[variant]}
        alt=""
        width={120}
        height={240}
        sizes="(max-width: 640px) 6vw, 5vw"
        priority={false}
      />
    </motion.div>
  );
}
