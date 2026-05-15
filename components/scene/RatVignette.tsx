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
  const [step, setStep] = useState<Step>("idle");

  useEffect(() => {
    if (reduce) {
      setStep("done");
      return;
    }
    const t = setTimeout(() => setStep("falling"), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <>
      <FallingBottle step={step} onLanded={() => setStep("running")} />
      <RunningRat step={step} onExited={() => setStep("done")} />
    </>
  );
}
