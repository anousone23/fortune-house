"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Leaf {
  id: number;
  startX: number;
  rotationWaypoints: [number, number, number, number];
  duration: number;
  xDrift: [number, number, number, number];
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

let nextLeafId = 1;
function makeLeaf(): Leaf {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const sign = Math.random() < 0.5 ? -1 : 1;
  return {
    id: nextLeafId++,
    startX: Math.random() * viewportWidth,
    rotationWaypoints: [
      0,
      sign * (60 + Math.random() * 120),
      -sign * (60 + Math.random() * 120),
      sign * (60 + Math.random() * 120),
    ],
    duration: 15 + Math.random() * 6,
    xDrift: [
      0,
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 140,
    ],
  };
}

export default function DriedLeaves() {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) return;
    const spawn = () => {
      setLeaves((prev) => [...prev, makeLeaf()]);
      timerRef.current = setTimeout(spawn, 10000 + Math.random() * 8000);
    };
    timerRef.current = setTimeout(spawn, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduce]);

  if (reduce) return null;

  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 1080;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 4 }}
    >
      <AnimatePresence>
        {leaves.map((l) => (
          <motion.div
            key={l.id}
            initial={{ x: l.startX, y: -100, rotate: 0, opacity: 0 }}
            animate={{
              x: [
                l.startX,
                l.startX + l.xDrift[1],
                l.startX + l.xDrift[2],
                l.startX + l.xDrift[3],
              ],
              y: viewportHeight + 100,
              rotate: l.rotationWaypoints,
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: l.duration,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1],
            }}
            onAnimationComplete={() =>
              setLeaves((prev) => prev.filter((x) => x.id !== l.id))
            }
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Image
              src="/scene/leaf.png"
              alt=""
              width={32}
              height={32}
              style={{ display: "block", height: "auto" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
