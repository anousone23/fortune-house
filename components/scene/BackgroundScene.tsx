import Image from "next/image";

export default function BackgroundScene() {
  return (
    <Image
      aria-hidden="true"
      src="/scene/main-bg.png"
      alt=""
      fill
      priority
      sizes="100vw"
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
  );
}
