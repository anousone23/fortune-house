import type { ReactNode } from "react";
import ButtonOrnament from "./ButtonOrnament";

interface OrnateButtonProps {
  variant: "primary" | "ghost";
  onClick: () => void;
  loading?: boolean;
  children: ReactNode;
}

export default function OrnateButton({
  variant,
  onClick,
  loading = false,
  children,
}: OrnateButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      data-variant={variant}
      disabled={loading}
      onClick={onClick}
      className="ornate-button relative inline-flex items-center justify-center active:scale-[0.97] disabled:opacity-60"
      style={{
        minHeight: 52,
        padding: "10px 56px",
        minWidth: 220,
        borderRadius: 999,
        border: "1px solid var(--gold-stroke)",
        background: isPrimary
          ? "linear-gradient(180deg, var(--cta-green-top), var(--cta-green-bottom))"
          : "linear-gradient(180deg, var(--cta-amber-top), var(--cta-amber-bottom))",
        color: isPrimary ? "var(--cta-green-text)" : "var(--cta-amber-text)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.4)",
        fontWeight: 600,
        fontFamily: "inherit",
        fontSize: "1rem",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "inline-flex",
          filter: "brightness(1.35) drop-shadow(0 0 1px rgba(230,212,163,0.5))",
        }}
      >
        <ButtonOrnament />
      </span>
      <span>{children}</span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -10,
          top: "50%",
          transform: "translateY(-50%) scaleX(-1)",
          display: "inline-flex",
          filter: "brightness(1.35) drop-shadow(0 0 1px rgba(230,212,163,0.5))",
        }}
      >
        <ButtonOrnament />
      </span>
    </button>
  );
}
