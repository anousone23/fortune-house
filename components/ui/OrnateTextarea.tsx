"use client";

import FrameCorners from "./FrameCorners";
import { useSceneState } from "@/app/SceneStateContext";

interface OrnateTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OrnateTextarea({ value, onChange }: OrnateTextareaProps) {
  const { setFocused } = useSceneState();

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
        onChange={(e) => onChange(e.target.value)}
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
    </div>
  );
}
