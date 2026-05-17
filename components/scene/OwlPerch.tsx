import Image from "next/image";

// The owl-perch.png is a 1920x1080 transparent PNG with the perch centered
// horizontally and vertically (perch occupies x≈44–57%, y≈14–81% of the
// source image). We render at the same scale as bg.png and translate so
// the perch's base sits near the floor of the scene on the right side.
//
// Tuning constants:
// - PERCH_X_OFFSET shifts the perch's horizontal center from 50% of bg → 89%
// - PERCH_Y_OFFSET shifts vertical center from ~48% → 55% (base ≈ 88%, top ≈ 21%)
const PERCH_X_OFFSET = "39%";
const PERCH_Y_OFFSET = "7%";

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
        transform: `translate(-50%, -50%) translate(${PERCH_X_OFFSET}, ${PERCH_Y_OFFSET})`,
        zIndex: 1,
      }}
    >
      <Image
        src="/scene/owl-perch.png"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
