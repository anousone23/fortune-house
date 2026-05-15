"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAnimate } from "framer-motion";
import Image from "next/image";
import type { Step } from "./RatVignette";

interface FallingBottleProps {
  step: Step;
  onLanded: () => void;
}

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getClientSnapshot(): boolean {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

const SHELF_X = "84vw";
const SHELF_Y = "22vh";
const FLOOR_Y = "80vh";

export default function FallingBottle({ step, onLanded }: FallingBottleProps) {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (reduce) return;
    if (step !== "falling") return;
    let cancelled = false;
    const run = async () => {
      await animate(
        scope.current,
        { y: "76vh", rotate: 45 },
        { duration: 0.75, ease: [0.55, 0, 0.85, 0.25] },
      );
      await animate(
        scope.current,
        { y: "78vh", rotate: 70 },
        { duration: 0.12, ease: "easeOut" },
      );
      await animate(
        scope.current,
        { y: FLOOR_Y, rotate: 90 },
        { duration: 0.18, ease: "easeOut" },
      );
      if (!cancelled) onLanded();
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [step, animate, scope, onLanded, reduce]);

  const initialStyle = reduce
    ? { left: SHELF_X, top: FLOOR_Y, transform: "translate(-50%, -50%) rotate(90deg)" }
    : { left: SHELF_X, top: SHELF_Y, transform: "translate(-50%, -50%) rotate(0deg)" };

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ ...initialStyle, zIndex: 5 }}
    >
      <Image
        src="/scene/bottle.png"
        alt=""
        width={60}
        height={120}
        style={{ display: "block", height: "auto" }}
      />
    </div>
  );
}
