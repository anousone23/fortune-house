import Image from "next/image";

// The owl-perch.png is a 1920x1080 transparent PNG with the perch centered
// horizontally and vertically (perch occupies x≈44–57%, y≈14–81% of the
// source image). We render at the same scale as bg.png and translate so
// the perch's base sits near the floor of the scene on the right side.
//
// Tuning constants:
// - PERCH_X_OFFSET shifts the perch's horizontal center from 50% of bg → 89%
// - PERCH_Y_OFFSET shifts vertical center down a bit so the base lands lower
// - PERCH_SCALE shrinks the perch visually around its center; 0.7 = 30% smaller
const PERCH_X_OFFSET = "39%";
const PERCH_Y_OFFSET = "10%";
const PERCH_SCALE = 0.7;

export default function OwlPerch() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "max(100vw, calc(100dvh * var(--bg-aspect)))",
        height: "max(100dvh, calc(100vw / var(--bg-aspect)))",
        transform: `translate(-50%, -50%) translate(${PERCH_X_OFFSET}, ${PERCH_Y_OFFSET}) scale(${PERCH_SCALE})`,
        zIndex: 1,
      }}
    >
      <Image
        src="/scene/owl-perch-v2.png"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
