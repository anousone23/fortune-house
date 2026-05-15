"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Petal {
  id: number;
  startX: number;
  rotation: number;
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

let nextPetalId = 1;
function makePetal(): Petal {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  return {
    id: nextPetalId++,
    startX: Math.random() * viewportWidth,
    rotation: (Math.random() * 2 - 1) * 540,
    duration: 7 + Math.random() * 4,
    xDrift: [
      0,
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
    ],
  };
}

export default function FallingPetals() {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [petals, setPetals] = useState<Petal[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) return;
    const spawn = () => {
      setPetals((prev) => [...prev, makePetal()]);
      timerRef.current = setTimeout(spawn, 6000 + Math.random() * 4000);
    };
    timerRef.current = setTimeout(spawn, 1000);
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
        {petals.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.startX, y: -100, rotate: 0, opacity: 0 }}
            animate={{
              x: [
                p.startX,
                p.startX + p.xDrift[1],
                p.startX + p.xDrift[2],
                p.startX + p.xDrift[3],
              ],
              y: viewportHeight + 100,
              rotate: p.rotation,
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              ease: "easeIn",
              times: [0, 0.1, 0.9, 1],
            }}
            onAnimationComplete={() =>
              setPetals((prev) => prev.filter((x) => x.id !== p.id))
            }
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Image
              src="/scene/petal.png"
              alt=""
              width={28}
              height={36}
              style={{ display: "block" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
