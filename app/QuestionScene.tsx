import BackgroundScene from "@/components/scene/BackgroundScene";
import Vignette from "@/components/scene/Vignette";
import CrystalBall from "@/components/scene/CrystalBall";
import Candelabra from "@/components/scene/Candelabra";
import DustMotes from "@/components/scene/DustMotes";
import MagicSparks from "@/components/scene/MagicSparks";
import FallingPetals from "@/components/scene/FallingPetals";
import DriedLeaves from "@/components/scene/DriedLeaves";
import RatEyes from "@/components/scene/RatEyes";
import Owl from "@/components/scene/Owl";
import HangingBundle from "@/components/scene/HangingBundle";
import OwlPerch from "@/components/scene/OwlPerch";
import ShelfBottle from "@/components/scene/ShelfBottle";
import QuestionForm from "./QuestionForm";
import { SceneStateProvider } from "./SceneStateContext";

export default function QuestionScene() {
  return (
    <SceneStateProvider>
      <main
        className="relative isolate flex flex-col items-center"
        style={{
          minHeight: "100dvh",
          background: "var(--ink-velvet-deep)",
          overflow: "hidden",
        }}
      >
        <BackgroundScene />
        <HangingBundle position="left" layer="back" />
        <HangingBundle position="right" layer="back" />
        <HangingBundle position="left" />
        <HangingBundle position="right" />
        <OwlPerch />
        {(["left", "right"] as const).map((side) => {
          const arrangement = side === "left"
            ? ([1, 4, 2, 6, 3, 5] as const)
            : ([3, 5, 6, 1, 4, 2] as const);
          return arrangement.map((variant, slot) => (
            <ShelfBottle
              key={`${side}-${slot}`}
              side={side}
              variant={variant}
              slot={slot as 0 | 1 | 2 | 3 | 4 | 5}
            />
          ));
        })}
        <Candelabra position="left" />
        <Candelabra position="right" />
        <Vignette />
        <CrystalBall />
        {/* <MagicSparks /> */}
        <FallingPetals />
        <DriedLeaves />
        <DustMotes />
        <Owl />
        <RatEyes />

        <div
          className="relative z-10 flex w-full max-w-[1100px] flex-col items-center px-6 pt-[8vh]"
          style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
        >
          <header
            className="text-center"
            style={{ animation: "fade-up 600ms ease-out both" }}
          >
            <h1
              className="font-semibold"
              style={{
                fontSize: "clamp(20px, 4.5vw, 36px)",
                color: "var(--text-primary)",
              }}
            >
              คุณอยากถามเรื่องอะไร ?
            </h1>
            <div
              aria-hidden="true"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                margin: "10px auto 12px",
                color: "var(--gold-stroke)",
              }}
            >
              <span
                style={{
                  width: 180,
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, var(--gold-stroke))",
                }}
              />
              <span style={{ fontSize: 10, letterSpacing: "0.2em" }}>✦✦✦</span>
              <span
                style={{
                  width: 180,
                  height: 1,
                  background:
                    "linear-gradient(to left, transparent, var(--gold-stroke))",
                }}
              />
            </div>
            <p style={{ color: "var(--text-muted)" }}>
              เลือกหัวข้อหรือพิมพ์คำถามที่คุณอยากรู้ในตอนนี้
            </p>
            <p style={{ marginTop: 4, color: "var(--text-muted)" }}>
              หรือคุณจะข้ามขั้นตอนนี้ไปก่อนก็ได้
            </p>
          </header>

          {/* Spacer where the orb sits behind the content */}
          <div
            style={{ height: "clamp(180px, 26vw, 320px)" }}
            aria-hidden="true"
          />

          <QuestionForm />
        </div>
      </main>
    </SceneStateProvider>
  );
}
