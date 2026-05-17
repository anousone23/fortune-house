"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSceneState } from "@/app/SceneStateContext";

interface CandleFlameProps {
  style?: React.CSSProperties;
  /** 0..5 — picks a slightly different playback rate so the six candles don't tick in lockstep */
  seed?: number;
}

// Small range around 1.0 so each candle plays at a slightly different speed
// without distorting the natural flicker rhythm.
const PLAYBACK_RATES = [0.88, 1.05, 0.95, 1.08, 0.92, 1.0];
const SLOW_RATE = 0.3;

export default function CandleFlame({ style, seed = 0 }: CandleFlameProps) {
  const reduce = useReducedMotion();
  const { state } = useSceneState();
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
      const baseRate = PLAYBACK_RATES[idx];
      v.playbackRate = state.focused ? baseRate * SLOW_RATE : baseRate;
      v.play().catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[CandleFlame] video.play() rejected:", err);
        }
      });
    }
  }, [reduce, idx, state.focused]);

  return (
    <div
      aria-hidden="true"
      className="candle-flame pointer-events-none absolute"
      style={style}
    >
      <video
        ref={videoRef}
        src="/scene/flame-alpha.webm"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
