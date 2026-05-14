import Image from "next/image";

export default function ButtonOrnament() {
  return (
    <Image
      src="/scene/button-ornament.png"
      alt=""
      width={60}
      height={48}
      aria-hidden="true"
      style={{ display: "block", height: "auto" }}
    />
  );
}
