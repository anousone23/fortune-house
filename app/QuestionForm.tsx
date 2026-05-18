"use client";

import { useState } from "react";
import OrnateTextarea from "@/components/ui/OrnateTextarea";
import TopicChip from "@/components/ui/TopicChip";
import OrnateButton from "@/components/ui/OrnateButton";
import { SUGGESTIONS } from "./suggestions";
import { useSceneState } from "./SceneStateContext";

export default function QuestionForm() {
  const { state, setSelectedChip, setHasText, startRitual } = useSceneState();
  const [question, setQuestion] = useState("");

  const handleChip = (id: string, text: string) => {
    if (state.selectedChipId === id) {
      setSelectedChip(null);
      setQuestion("");
      setHasText(false);
      return;
    }
    setSelectedChip(id);
    setQuestion(text);
    setHasText(text.length > 0);
  };

  const handleChange = (next: string) => {
    setQuestion(next);
    setHasText(next.length > 0);
    if (state.selectedChipId !== null) {
      const selected = SUGGESTIONS.find((s) => s.id === state.selectedChipId);
      if (!selected || next !== selected.text) setSelectedChip(null);
    }
  };

  const handleStart = () => {
    startRitual();
    console.log({ question });
    setQuestion("");
    setHasText(false);
    setSelectedChip(null);
  };
  const handleSkip = () => console.log("skipped");

  return (
    <>
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
            id={s.id}
            label={s.label}
            selected={state.selectedChipId === s.id}
            onClick={() => handleChip(s.id, s.text)}
          />
        ))}
      </div>

      <div
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
        style={{ animation: "fade-up 600ms ease-out 400ms both" }}
      >
        <OrnateButton variant="primary" onClick={handleStart} loading={state.ritualActive}>
          เริ่มเลือกไพ่
        </OrnateButton>
        <OrnateButton variant="ghost" onClick={handleSkip}>
          ข้าม
        </OrnateButton>
      </div>
    </>
  );
}
