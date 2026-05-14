"use client";

import { useState } from "react";
import BackgroundScene from "@/components/scene/BackgroundScene";
import Vignette from "@/components/scene/Vignette";
import CrystalBall from "@/components/scene/CrystalBall";
import Candelabra from "@/components/scene/Candelabra";
import OrbRipples from "@/components/scene/OrbRipples";
import DustMotes from "@/components/scene/DustMotes";
import OrnateTextarea from "@/components/ui/OrnateTextarea";
import TopicChip from "@/components/ui/TopicChip";
import OrnateButton from "@/components/ui/OrnateButton";
import { SUGGESTIONS } from "./suggestions";

export default function QuestionScene() {
  const [question, setQuestion] = useState("");
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);

  const handleChip = (id: string, text: string) => {
    setSelectedChipId(id);
    setQuestion(text);
  };

  const handleChange = (next: string) => {
    setQuestion(next);
    if (selectedChipId !== null) {
      const selected = SUGGESTIONS.find((s) => s.id === selectedChipId);
      if (!selected || next !== selected.text) setSelectedChipId(null);
    }
  };

  const handleStart = () => console.log({ question });
  const handleSkip = () => console.log("skipped");

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
      <DustMotes />

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

        <div
          className="w-full"
          style={{
            maxWidth: 720,
            animation: "fade-up 600ms ease-out 240ms both",
          }}
        >
          <OrnateTextarea value={question} onChange={handleChange} />
        </div>

        <div
          role="group"
          aria-label="หัวข้อคำถามแนะนำ"
          className="chip-row mt-6 flex w-full max-w-[820px] gap-2 sm:gap-3"
          style={{ animation: "fade-up 600ms ease-out 320ms both" }}
        >
          {SUGGESTIONS.map((s) => (
            <TopicChip
              key={s.id}
              label={s.label}
              selected={selectedChipId === s.id}
              onClick={() => handleChip(s.id, s.text)}
            />
          ))}
        </div>

        <div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          style={{ animation: "fade-up 600ms ease-out 400ms both" }}
        >
          <OrnateButton variant="primary" onClick={handleStart}>
            เริ่มเลือกไพ่
          </OrnateButton>
          <OrnateButton variant="ghost" onClick={handleSkip}>
            ข้าม
          </OrnateButton>
        </div>
      </div>
    </main>
  );
}
