import Image from "next/image";

// The OUTER wrapper below mimics the bg image's object-fit:cover transform,
// so its rectangle matches the bg image's rendered area pixel-for-pixel —
// regardless of viewport size. A child placed at "X%, Y%" of the outer wrapper
// is then pinned to that exact point on the bg image as the viewport changes.
// `--bg-aspect` is defined in tokens.css so all bg-anchored elements share one
// source of truth — if the bg image is swapped, update the token, not this file.

// Owl position as a percentage of the BG IMAGE (not the viewport).
// 0% = top/left of the image, 100% = bottom/right.
// Currently anchored to the top of the wooden perch added via OwlPerch.tsx —
// tune in the browser if it doesn't land squarely on the perch's flat top.
const OWL_X_PCT = "89%";
const OWL_Y_PCT = "57%";
const OWL_WIDTH = 140;
const OWL_HEIGHT = 160;
const HEAD_TOP = "5%";
const HEAD_LEFT = "24%";
const HEAD_WIDTH_PCT = "60%";

export default function Owl() {
  return (
    <div
      aria-hidden="true"
      className="owl-mount pointer-events-none"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "max(100vw, calc(100dvh * var(--bg-aspect)))",
        height: "max(100dvh, calc(100vw / var(--bg-aspect)))",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    >
      <div
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
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
            }}
          />
          <div
            className="owl-head"
            style={{
              position: "absolute",
              top: HEAD_TOP,
              left: HEAD_LEFT,
              width: HEAD_WIDTH_PCT,
            }}
          >
            <Image
              src="/scene/owl-head.png"
              alt=""
              width={60}
              height={80}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
