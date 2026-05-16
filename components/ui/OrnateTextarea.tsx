"use client";

import { useRef, useState } from "react";
import FrameCorners from "./FrameCorners";
import KeystrokeSparks, { type Spark } from "@/components/scene/KeystrokeSparks";
import { useSceneState } from "@/app/SceneStateContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrnateTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

let nextSparkId = 1;

export default function OrnateTextarea({ value, onChange }: OrnateTextareaProps) {
  const { setFocused } = useSceneState();
  const reduce = useReducedMotion();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastSpawnRef = useRef(0);

  const spawnSparks = () => {
    if (reduce) return;
    const now = Date.now();
    if (now - lastSpawnRef.current < 60) return; // debounce 60ms
    lastSpawnRef.current = now;
    const newSparks: Spark[] = [
      {
        id: nextSparkId++,
        cornerX: Math.random() < 0.5 ? 0 : 1,
        cornerY: Math.random() < 0.5 ? 0 : 1,
      },
    ];
    if (Math.random() < 0.4) {
      newSparks.push({
        id: nextSparkId++,
        cornerX: Math.random() < 0.5 ? 0 : 1,
        cornerY: Math.random() < 0.5 ? 0 : 1,
      });
    }
    setSparks((prev) => [...prev, ...newSparks]);
    // remove after 600ms (animation 500ms + buffer)
    newSparks.forEach((s) => {
      setTimeout(() => {
        setSparks((prev) => prev.filter((p) => p.id !== s.id));
      }, 600);
    });
  };

  return (
    <div
      className="ornate-textarea-frame relative w-full"
      style={{
        background: "rgba(26, 5, 8, 0.72)",
        border: "1px solid var(--gold-stroke)",
        borderRadius: "var(--radius-sm)",
        padding: "16px 28px",
        minHeight: 108,
      }}
    >
      <FrameCorners />
      <label htmlFor="question-input" className="sr-only">คำถามของคุณ</label>
      <textarea
        id="question-input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          spawnSparks();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="พิมพ์คำถามของคุณ…(ไม่บังคับ)"
        rows={3}
        className="w-full resize-none bg-transparent outline-none placeholder:opacity-60"
        style={{
          color: "var(--text-primary)",
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
        }}
      />
      <KeystrokeSparks sparks={sparks} />
    </div>
  );
}
