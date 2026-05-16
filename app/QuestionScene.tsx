import BackgroundScene from "@/components/scene/BackgroundScene";
import Vignette from "@/components/scene/Vignette";
import CrystalBall from "@/components/scene/CrystalBall";
import Candelabra from "@/components/scene/Candelabra";
import OrbRipples from "@/components/scene/OrbRipples";
import DustMotes from "@/components/scene/DustMotes";
import MagicSparks from "@/components/scene/MagicSparks";
import FallingPetals from "@/components/scene/FallingPetals";
import DriedLeaves from "@/components/scene/DriedLeaves";
import RatEyes from "@/components/scene/RatEyes";
import Owl from "@/components/scene/Owl";
import QuestionForm from "./QuestionForm";

export default function QuestionScene() {
  return (
    <main
      className="relative isolate flex flex-col items-center"
      style={{
        minHeight: "100dvh",
        background: "var(--ink-velvet-deep)",
        overflow: "hidden",
      }}
    >
      <BackgroundScene />
      <Candelabra position="left" />
      <Candelabra position="right" />
      <Vignette />
      <OrbRipples />
      <CrystalBall />
      <MagicSparks />
      <FallingPetals />
      <DriedLeaves />
      <DustMotes />
      <Owl />
      <RatEyes />

      <div
        className="relative z-10 flex w-full max-w-[1100px] flex-col items-center px-6 pt-[8vh]"
        style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
      >
        <header className="text-center" style={{ animation: "fade-up 600ms ease-out both" }}>
          <h1
            className="font-semibold"
            style={{
              fontSize: "clamp(20px, 4.5vw, 36px)",
              color: "var(--text-primary)",
            }}
          >
            คุณอยากถามเรื่องอะไร ?
          </h1>
          <p style={{ marginTop: 8, color: "var(--text-muted)" }}>
            เลือกหัวข้อหรือพิมพ์คำถามที่คุณอยากรู้ในตอนนี้
          </p>
        </header>

        {/* Spacer where the orb sits behind the content */}
        <div style={{ height: "clamp(220px, 32vw, 380px)" }} aria-hidden="true" />

        <QuestionForm />
      </div>
    </main>
  );
}
