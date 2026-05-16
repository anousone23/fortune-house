"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import OrnateTextarea from "@/components/ui/OrnateTextarea";
import TopicChip from "@/components/ui/TopicChip";
import OrnateButton from "@/components/ui/OrnateButton";
import ChipWisp from "@/components/scene/ChipWisp";
import { SUGGESTIONS } from "./suggestions";
import { useSceneState } from "./SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function QuestionForm() {
  const { state, setSelectedChip, setHasText } = useSceneState();
  const [question, setQuestion] = useState("");

  const reduce = useReducedMotion();
  const chipRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [activeWisp, setActiveWisp] = useState<{
    id: string;
    fromRect: { x: number; y: number };
    toRect: { x: number; y: number };
    themeColor: string;
  } | null>(null);

  useEffect(() => {
    if (reduce) {
      setActiveWisp(null);
      return;
    }
    if (!state.hoveredChipId) {
      setActiveWisp(null);
      return;
    }
    const chip = chipRefs.current.get(state.hoveredChipId);
    if (!chip) return;
    const chipRect = chip.getBoundingClientRect();
    const orbEl = document.querySelector(".crystal-ball") as HTMLElement | null;
    const orbRect = orbEl
      ? orbEl.getBoundingClientRect()
      : ({
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          width: 0,
          height: 0,
        } as DOMRect);
    const suggestion = SUGGESTIONS.find((s) => s.id === state.hoveredChipId);
    setActiveWisp({
      id: `${state.hoveredChipId}-${Date.now()}`,
      fromRect: {
        x: chipRect.left + chipRect.width / 2 - 6,
        y: chipRect.top + chipRect.height / 2 - 6,
      },
      toRect: {
        x: orbRect.left + orbRect.width / 2 - 6,
        y: orbRect.top + orbRect.height / 2 - 6,
      },
      themeColor: suggestion?.themeColor ?? "#B26BFF",
    });
  }, [state.hoveredChipId, reduce]);

  const handleChip = (id: string, text: string) => {
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

  const handleStart = () => console.log({ question });
  const handleSkip = () => console.log("skipped");

  return (
    <>
      <div className="w-full" style={{ maxWidth: 720, animation: "fade-up 600ms ease-out 240ms both" }}>
        <OrnateTextarea value={question} onChange={handleChange} />
      </div>

      <div
        role="group"
        aria-label="หัวข้อคำถามแนะนำ"
        className="chip-row mt-6 flex w-full max-w-[820px] gap-2 sm:gap-3"
        style={{ animation: "fade-up 600ms ease-out 320ms both" }}
      >
        {SUGGESTIONS.map((s, idx) => {
          const fanAngle = -12 + (24 / (SUGGESTIONS.length - 1)) * idx;
          return (
            <TopicChip
              key={s.id}
              id={s.id}
              label={s.label}
              selected={state.selectedChipId === s.id}
              onClick={() => handleChip(s.id, s.text)}
              fanAngle={fanAngle}
              chipRef={(el) => {
                if (el) chipRefs.current.set(s.id, el);
                else chipRefs.current.delete(s.id);
              }}
            />
          );
        })}
      </div>

      <div
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
        style={{ animation: "fade-up 600ms ease-out 400ms both" }}
      >
        <OrnateButton variant="primary" onClick={handleStart}>เริ่มเลือกไพ่</OrnateButton>
        <OrnateButton variant="ghost" onClick={handleSkip}>ข้าม</OrnateButton>
      </div>

      <AnimatePresence>
        {activeWisp && (
          <ChipWisp
            key={activeWisp.id}
            fromRect={activeWisp.fromRect}
            toRect={activeWisp.toRect}
            themeColor={activeWisp.themeColor}
          />
        )}
      </AnimatePresence>
    </>
  );
}
