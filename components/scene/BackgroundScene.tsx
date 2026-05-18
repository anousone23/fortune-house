import Image from "next/image";

export default function BackgroundScene() {
  return (
    <Image
      aria-hidden="true"
      src="/scene/background.png"
      alt=""
      fill
      priority
      sizes="100vw"
      className="bg-scene-img"
      style={{ objectFit: "cover" }}
    />
  );
}
