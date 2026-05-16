"use client";

import Image from "next/image";

export default function OrbGeometry() {
  return (
    <div
      aria-hidden="true"
      className="orb-geometry pointer-events-none absolute inset-0"
      style={{
        color: "var(--gold-primary)",
        mixBlendMode: "screen",
        opacity: 0.3,
        animation: "orb-rotate 60s linear infinite",
      }}
    >
      <Image
        src="/scene/orb-geometry.svg"
        alt=""
        fill
        sizes="(max-width: 640px) 30vw, 18vw"
        style={{ objectFit: "contain" }}
        priority={false}
      />
    </div>
  );
}
