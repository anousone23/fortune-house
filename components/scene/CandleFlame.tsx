"use client";

import { useSyncExternalStore } from "react";

interface CandleFlameProps {
  style?: React.CSSProperties;
  /** 0..5 — picks a slightly different cycle duration & phase so flames don't sync */
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

// Per-instance cycle durations (ms) and phase delays. Six distinct values so
// the candelabra's six flames all drift relative to each other instead of
// flickering in unison. Durations differ enough that even after several cycles
// they don't realign — that's the trick that makes it look organic.
const DURATIONS = [1800, 1700, 1900, 2000, 1750, 1850];
const DELAYS = [0, 130, 290, 70, 410, 200];
const FRAME_COUNT = 12;

export default function CandleFlame({ style, seed = 0 }: CandleFlameProps) {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const idx = ((seed % DURATIONS.length) + DURATIONS.length) % DURATIONS.length;
  const cssVars = {
    "--flame-duration": `${DURATIONS[idx]}ms`,
    "--flame-delay": `${DELAYS[idx]}ms`,
  } as React.CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="candle-flame pointer-events-none absolute"
      data-reduce={reduce ? "1" : "0"}
      style={{ width: 40, height: 60, ...cssVars, ...style }}
    >
      {Array.from({ length: FRAME_COUNT }, (_, i) => (
        <img
          key={i}
          src={`/scene/flame-${i + 1}.png`}
          alt=""
          className={`flame-frame flame-frame-${i + 1}`}
        />
      ))}
    </div>
  );
}
