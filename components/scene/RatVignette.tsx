"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import FallingBottle from "./FallingBottle";
import RunningRat from "./RunningRat";

export type Step = "idle" | "falling" | "running" | "done";

const TRIGGER_DELAY_MS = 3500;
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

export default function RatVignette() {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [internalStep, setInternalStep] = useState<Step>("idle");
  // When reduced motion is on, the step is always "done" — derived, not setState.
  // Avoids a synchronous setState-in-effect that React 19's lint rule flags.
  const step: Step = reduce ? "done" : internalStep;

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setInternalStep("falling"), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <>
      <FallingBottle step={step} onLanded={() => setInternalStep("running")} />
      <RunningRat step={step} onExited={() => setInternalStep("done")} />
    </>
  );
}
