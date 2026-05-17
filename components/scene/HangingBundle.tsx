import Image from "next/image";

type Props = { position: "left" | "right" };

export default function HangingBundle({ position }: Props) {
  const src =
    position === "left"
      ? "/scene/herb-bundle-left.png"
      : "/scene/herb-bundle-right.png";

  return (
    <div
      aria-hidden="true"
      className="hanging-bundle pointer-events-none"
      data-side={position}
    >
      <Image
        src={src}
        alt=""
        width={300}
        height={450}
        sizes="(max-width: 640px) 90px, 13vw"
        priority={false}
      />
    </div>
  );
}
