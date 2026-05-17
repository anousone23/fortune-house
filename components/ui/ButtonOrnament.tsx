import Image from "next/image";

export default function ButtonOrnament() {
  return (
    <Image
      src="/scene/button-ornament.png"
      alt=""
      width={74}
      height={96}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
