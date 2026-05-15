"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface CandleFlameProps {
  style?: React.CSSProperties;
  /** 0..5 — picks a slightly different playback rate so the six candles don't tick in lockstep */
  seed?: number;
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

// Small range around 1.0 so each candle plays at a slightly different speed
// without distorting the natural flicker rhythm.
const PLAYBACK_RATES = [0.88, 1.05, 0.95, 1.08, 0.92, 1.0];

export default function CandleFlame({ style, seed = 0 }: CandleFlameProps) {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const idx =
    ((seed % PLAYBACK_RATES.length) + PLAYBACK_RATES.length) %
    PLAYBACK_RATES.length;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduce) {
      v.pause();
    } else {
      v.playbackRate = PLAYBACK_RATES[idx];
      v.play().catch(() => {});
    }
  }, [reduce, idx]);

  return (
    <div
      aria-hidden="true"
      className="candle-flame pointer-events-none absolute"
      style={{ width: 28, height: 56, ...style }}
    >
      <video
        ref={videoRef}
        src="/scene/flame-alpha.webm"
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
          filter:
            "drop-shadow(0 0 6px rgba(255, 160, 80, 0.55)) drop-shadow(0 0 18px rgba(255, 130, 40, 0.35))",
        }}
      />
    </div>
  );
}
