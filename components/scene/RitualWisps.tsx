"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ChipWisp from "./ChipWisp";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WISP_COUNT = 8;
const WISP_STAGGER_MS = 80;
const WISP_START_DELAY_MS = 400;
const WISP_THEME_COLOR = "#E6D4A3";

interface Wisp {
  id: string;
  fromRect: { x: number; y: number };
  toRect: { x: number; y: number };
}

export default function RitualWisps() {
  const { state } = useSceneState();
  const reduce = useReducedMotion();
  const [wisps, setWisps] = useState<Wisp[]>([]);

  useEffect(() => {
    if (reduce) return;
    if (!state.ritualActive) {
      setWisps([]);
      return;
    }
    const anchors: Element[] = [
      ...Array.from(document.querySelectorAll(".candelabra")),
      ...Array.from(
        document.querySelectorAll('.hanging-bundle[data-layer="front"]'),
      ),
      ...Array.from(document.querySelectorAll(".shelf-bottle")),
    ];
    if (anchors.length === 0) return;
    const orbEl = document.querySelector(".crystal-ball") as HTMLElement | null;
    if (!orbEl) return;
    const orbRect = orbEl.getBoundingClientRect();
    const orbCenter = {
      x: orbRect.left + orbRect.width / 2 - 6,
      y: orbRect.top + orbRect.height / 2 - 6,
    };

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < WISP_COUNT; i++) {
      const t = setTimeout(() => {
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];
        const r = anchor.getBoundingClientRect();
        const fromRect = {
          x: r.left + r.width / 2 - 6,
          y: r.top + r.height / 2 - 6,
        };
        const id = `ritual-${Date.now()}-${i}`;
        setWisps((prev) => [...prev, { id, fromRect, toRect: orbCenter }]);
      }, WISP_START_DELAY_MS + i * WISP_STAGGER_MS);
      timeouts.push(t);
    }
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [state.ritualActive, reduce]);

  return (
    <AnimatePresence>
      {wisps.map((w) => (
        <ChipWisp
          key={w.id}
          fromRect={w.fromRect}
          toRect={w.toRect}
          themeColor={WISP_THEME_COLOR}
        />
      ))}
    </AnimatePresence>
  );
}
