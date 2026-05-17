"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Layer = "front" | "back";
type Props = { position: "left" | "right"; layer?: Layer };

interface Leaf {
  id: number;
  x: number;
  y: number;
  drift: [number, number, number];
  rotations: [number, number, number];
  duration: number;
}

let nextLeafId = 1;
function makeLeaf(x: number, y: number): Leaf {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return {
    id: nextLeafId++,
    x: x + (Math.random() - 0.5) * 40,
    y,
    drift: [
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60,
    ],
    rotations: [
      sign * (40 + Math.random() * 80),
      -sign * (40 + Math.random() * 80),
      sign * (40 + Math.random() * 80),
    ],
    duration: 3 + Math.random() * 1.5,
  };
}

const LEAF_DELAYS_MS = [100, 180, 260, 340, 420];

export default function HangingBundle({ position, layer = "front" }: Props) {
  const src =
    position === "left"
      ? "/scene/herb-bundle-left.png"
      : "/scene/herb-bundle-right.png";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"idle" | "active">("idle");
  const controls = useAnimationControls();
  const reduce = useReducedMotion();
  const [isShaking, setIsShaking] = useState(false);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const interactive = layer === "front";

  const handleHover = async () => {
    if (!interactive || reduce || phaseRef.current !== "idle") return;
    phaseRef.current = "active";

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) {
      phaseRef.current = "idle";
      return;
    }
    const centerX = rect.left + rect.width / 2;
    const bottomY = rect.bottom;

    setIsShaking(true);

    const timeouts = LEAF_DELAYS_MS.map((delay) =>
      setTimeout(() => {
        setLeaves((prev) => [...prev, makeLeaf(centerX, bottomY)]);
      }, delay),
    );

    try {
      await controls.start({
        rotate: [0, -6, 5, -5, 4, -3, 2, 0],
        transition: {
          duration: 0.44,
          ease: "easeInOut",
          times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1],
        },
      });
    } finally {
      timeouts.forEach(clearTimeout);
      setIsShaking(false);
      phaseRef.current = "idle";
    }
  };

  const removeLeaf = (id: number) =>
    setLeaves((prev) => prev.filter((l) => l.id !== id));

  const className = [
    "hanging-bundle",
    interactive ? "" : "pointer-events-none",
    isShaking ? "is-shaking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <motion.div
        ref={wrapperRef}
        aria-hidden="true"
        className={className}
        data-side={position}
        data-layer={layer}
        animate={controls}
        onMouseEnter={interactive ? handleHover : undefined}
      >
        <Image
          src={src}
          alt=""
          width={300}
          height={450}
          sizes="(max-width: 640px) 90px, 13vw"
          priority={false}
        />
      </motion.div>
      {mounted && leaves.length > 0
        ? createPortal(
            <>
              {leaves.map((l) => (
                <div
                  key={l.id}
                  className="bundle-leaf"
                  style={
                    {
                      "--bl-x": `${l.x}px`,
                      "--bl-y": `${l.y}px`,
                      "--bl-d1": `${l.drift[0]}px`,
                      "--bl-d2": `${l.drift[1]}px`,
                      "--bl-d3": `${l.drift[2]}px`,
                      "--bl-r1": `${l.rotations[0]}deg`,
                      "--bl-r2": `${l.rotations[1]}deg`,
                      "--bl-r3": `${l.rotations[2]}deg`,
                      "--bl-duration": `${l.duration}s`,
                    } as React.CSSProperties
                  }
                  onAnimationEnd={() => removeLeaf(l.id)}
                >
                  <Image
                    src="/scene/leaf.png"
                    alt=""
                    width={24}
                    height={24}
                    style={{ display: "block" }}
                  />
                </div>
              ))}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
