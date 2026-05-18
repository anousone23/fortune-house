"use client";

// Cabinet peeking door — left cabinet only.
//
// Layering (z within component):
//   1. dark backdrop (rectangle, exactly the panel's footprint) — what
//      shows in the wedge when the panel rotates open
//   2. panel overlay (cabinet-panel-left.png cropped from bg.png) — sits
//      pixel-aligned over the painted panel; rotates -15deg on outer-edge
//      hinge to reveal a sliver of the backdrop
//
// Positioning: a bg-aspect-cover wrapper mirrors bg.png's object-fit:cover
// rectangle, so percentage-positioned children pin to the bg image, not the
// viewport. Mirror of Owl.tsx pattern.
//
// Mobile (<=640px): the whole component is display:none via .cabinet-peek
// (matches .owl-mount precedent — scaled mobile bg doesn't have a slot).

import Image from "next/image";

// Panel placement as % of bg image's intrinsic size — values locked in via
// public/preview-cabinet-peek.html against bg.png. Don't change without
// re-validating in the preview.
const PANEL_LEFT = "9.5%";
const PANEL_TOP = "44%";
const PANEL_WIDTH = "7%";
const PANEL_HEIGHT = "26.5%";

export default function CabinetPeek() {
  return (
    <div
      aria-hidden="true"
      className="cabinet-peek pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "max(100vw, calc(100dvh * var(--bg-aspect)))",
        height: "max(100dvh, calc(100vw / var(--bg-aspect)))",
        transform: "translate(-50%, -50%)",
        perspective: "1200px",
        zIndex: 2,
      }}
    >
      {/* Dark backdrop — sits exactly under the panel */}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
          background: "#050203",
        }}
      />
      {/* Panel overlay — pixel-aligned with painted panel in bg.png */}
      <div
        style={{
          position: "absolute",
          left: PANEL_LEFT,
          top: PANEL_TOP,
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
        }}
      >
        <Image
          src="/scene/cabinet-panel-left.png"
          alt=""
          fill
          sizes="20vw"
          style={{ objectFit: "cover", display: "block" }}
          priority={false}
        />
      </div>
    </div>
  );
}
