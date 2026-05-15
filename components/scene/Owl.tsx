"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSyncExternalStore } from "react";

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

// The bg image is 2400×1340 (aspect ≈ 1.791) rendered with object-fit:cover.
// The OUTER wrapper below mimics that cover transform, so its rectangle matches
// the bg image's rendered area pixel-for-pixel — regardless of viewport size.
// That means a child placed at "X%, Y%" of the outer wrapper is pinned to that
// exact point on the bg image and stays there as the viewport changes.
const BG_ASPECT = 2400 / 1340;

// Owl position as a percentage of the BG IMAGE (not the viewport).
// 0% = top/left of the image, 100% = bottom/right.
// Tune in the browser until the owl sits on the shelf where you want.
const OWL_X_PCT = "81%";
const OWL_Y_PCT = "38%";
const OWL_WIDTH = 140;
const OWL_HEIGHT = 160;
const HEAD_TOP = "5%";
const HEAD_LEFT = "24%";
const HEAD_WIDTH_PCT = "60%";

export default function Owl() {
  const reduce = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <div
      aria-hidden="true"
      className="owl-mount pointer-events-none"
      // Replicates object-fit: cover + object-position: center for the bg image.
      // Width  = max(100vw, 100dvh * imageAspect)  →  image rendered width
      // Height = max(100dvh, 100vw / imageAspect)  →  image rendered height
      // Centered so cropping is symmetric.
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `max(100vw, calc(100dvh * ${BG_ASPECT}))`,
        height: `max(100dvh, calc(100vw / ${BG_ASPECT}))`,
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      <div
        // Inner positioning wrapper: pins to a point on the bg image.
        style={{
          position: "absolute",
          left: OWL_X_PCT,
          top: OWL_Y_PCT,
          width: OWL_WIDTH,
          height: OWL_HEIGHT,
          transform: "translate(-50%, -100%)",
          rotate: "-6deg",
          filter:
            "brightness(0.82) sepia(0.18) hue-rotate(-8deg) contrast(1.05) drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.6))",
        }}
      >
        {/* Inner wrapper flips the visual horizontally so the owl faces left. */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: "scaleX(-1)",
          }}
        >
          <Image
            src="/scene/owl-body.png"
            alt=""
            width={OWL_WIDTH}
            height={OWL_HEIGHT}
            style={{
              display: "block",
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "auto",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: HEAD_TOP,
              left: HEAD_LEFT,
              width: HEAD_WIDTH_PCT,
              transformOrigin: "50% 80%",
            }}
            animate={
              reduce
                ? { rotate: 0 }
                : {
                    rotate: [0, -15, 0, 18, 0, -8, 4, 0],
                  }
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
            }}
          >
            <Image
              src="/scene/owl-head.png"
              alt=""
              width={60}
              height={80}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
