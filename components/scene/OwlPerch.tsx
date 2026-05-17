import Image from "next/image";

// Bounding region of the perch within the 1920x1080 source image, expressed
// as inset percentages (top, right, bottom, left). The full owl-perch.png is
// a duplicate of the scene with a wooden perch added on the right; we render
// it on top of bg.png and clip everything except the perch's area so only
// the new element shows through.
const PERCH_INSET = "50% 4% 12% 82%";

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
        transform: "translate(-50%, -50%)",
        clipPath: `inset(${PERCH_INSET})`,
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
