"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Layer = "front" | "back";
type Props = { position: "left" | "right"; layer?: Layer };

export default function HangingBundle({ position, layer = "front" }: Props) {
  const src =
    position === "left"
      ? "/scene/herb-bundle-left.png"
      : "/scene/herb-bundle-right.png";

  const phaseRef = useRef<"idle" | "active">("idle");
  const controls = useAnimationControls();
  const reduce = useReducedMotion();
  const [isShaking, setIsShaking] = useState(false);

  const interactive = layer === "front";

  const handleHover = async () => {
    if (!interactive || reduce || phaseRef.current !== "idle") return;
    phaseRef.current = "active";

    setIsShaking(true);

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
      setIsShaking(false);
      phaseRef.current = "idle";
    }
  };

  const className = [
    "hanging-bundle",
    interactive ? "" : "pointer-events-none",
    isShaking ? "is-shaking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
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
  );
}
