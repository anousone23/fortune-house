import Image from "next/image";

export default function CrystalBall() {
  return (
    <div
      className="crystal-ball pointer-events-none absolute"
      style={{
        left: "var(--orb-x)",
        top: "var(--orb-y)",
        transform: "translate(-50%, -48%)",
        aspectRatio: "1 / 1",
      }}
    >
      <div
        className="orb-glow absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(178,107,255,0.55) 0%, rgba(91,31,174,0.35) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/scene/orb-mobile.png"
        />
        <Image
          src="/scene/orb.png"
          alt=""
          width={760}
          height={760}
          sizes="(max-width: 640px) 40vw, 24vw"
          preload
          style={{ width: "100%", height: "auto", position: "relative" }}
        />
      </picture>
    </div>
  );
}
