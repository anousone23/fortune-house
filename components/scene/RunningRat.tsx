"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAnimate } from "framer-motion";
import Image from "next/image";
import type { Step } from "./RatVignette";

interface RunningRatProps {
  step: Step;
  onExited: () => void;
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

const HIDDEN_X = "92vw";
const EMERGE_X = "87vw";
const EXIT_X = "-10vw";
const RUN_Y = "85vh";

export default function RunningRat({ step, onExited }: RunningRatProps) {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (reduce) return;
    if (step !== "running") return;
    let cancelled = false;
    const run = async () => {
      // Phase 1: emerge from under the cabinet
      await animate(
        scope.current,
        { opacity: 1, x: EMERGE_X },
        { duration: 0.25, ease: "easeOut" },
      );
      // Phase 2: scurry left with bob + tilt
      await animate(
        scope.current,
        {
          x: EXIT_X,
          y: [RUN_Y, "84vh", RUN_Y, "84vh", RUN_Y, "84vh", RUN_Y],
          rotate: [0, -3, 0, 3, 0, -3, 0],
        },
        {
          duration: 2.6,
          ease: "linear",
          times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
        },
      );
      // Phase 3: fade out
      await animate(
        scope.current,
        { opacity: 0 },
        { duration: 0.15, ease: "easeIn" },
      );
      if (!cancelled) onExited();
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [step, animate, scope, onExited, reduce]);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: 0,
        top: 0,
        x: HIDDEN_X,
        y: RUN_Y,
        opacity: 0,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
      }}
    >
      <Image
        src="/scene/rat.png"
        alt=""
        width={50}
        height={30}
        style={{ display: "block", height: "auto" }}
      />
    </div>
  );
}
