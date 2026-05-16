import Image from "next/image";

export default function BackgroundScene() {
  return (
    <picture
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, display: "block" }}
    >
      <source
        media="(max-width: 640px)"
        srcSet="/scene/bg-chamber-mobile.jpeg"
      />
      <Image
        src="/scene/bg-chamber-desktop-without-candles.png"
        alt=""
        fill
        preload
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </picture>
  );
}
