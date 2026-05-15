"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useSyncExternalStore } from "react";

interface CandleSmokeProps {
  style?: React.CSSProperties;
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

export default function CandleSmoke({ style }: CandleSmokeProps) {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ width: 32, height: 90, opacity: 0.4, ...style }}
    >
      <DotLottieReact
        src="/lottie/smoke.json"
        loop={!reduce}
        autoplay={!reduce}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
