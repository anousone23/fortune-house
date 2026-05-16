import Image from "next/image";

export default function CrystalBall() {
  return (
    <div
      className="crystal-ball pointer-events-none absolute"
      style={{
        left: "var(--orb-x)",
        top: "var(--orb-y)",
        transform: "translate(-50%, -72%)",
        aspectRatio: "1 / 1",
      }}
    >
<picture>
        <source media="(max-width: 640px)" srcSet="/scene/orb-mobile.png" />
        <Image
          src="/scene/orb.png"
          alt=""
          width={760}
          height={760}
          sizes="(max-width: 640px) 40vw, 24vw"
          priority
          style={{ width: "100%", height: "auto", position: "relative" }}
        />
      </picture>
    </div>
  );
}
