"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SUGGESTIONS } from "./suggestions";

export type SceneState = {
  focused: boolean;
  hoveredChipId: string | null;
  selectedChipId: string | null;
  hasText: boolean;
  ritualActive: boolean;
};

type SceneAction =
  | { type: "SET_FOCUSED"; value: boolean }
  | { type: "SET_HOVERED_CHIP"; id: string | null }
  | { type: "SET_SELECTED_CHIP"; id: string | null }
  | { type: "SET_HAS_TEXT"; value: boolean }
  | { type: "SET_RITUAL_ACTIVE"; value: boolean };

const initialState: SceneState = {
  focused: false,
  hoveredChipId: null,
  selectedChipId: null,
  hasText: false,
  ritualActive: false,
};

function reducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case "SET_FOCUSED":
      return state.focused === action.value ? state : { ...state, focused: action.value };
    case "SET_HOVERED_CHIP":
      return state.hoveredChipId === action.id ? state : { ...state, hoveredChipId: action.id };
    case "SET_SELECTED_CHIP":
      return state.selectedChipId === action.id ? state : { ...state, selectedChipId: action.id };
    case "SET_HAS_TEXT":
      return state.hasText === action.value ? state : { ...state, hasText: action.value };
    case "SET_RITUAL_ACTIVE":
      return state.ritualActive === action.value
        ? state
        : { ...state, ritualActive: action.value };
    default:
      return state;
  }
}

type SceneContextValue = {
  state: SceneState;
  ready: boolean;
  energy: MotionValue<number>;
  tintColor: string | null;
  setFocused: (v: boolean) => void;
  setHoveredChip: (id: string | null) => void;
  setSelectedChip: (id: string | null) => void;
  setHasText: (v: boolean) => void;
  startRitual: () => void;
};

const SceneStateContext = createContext<SceneContextValue | null>(null);

export function SceneStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const energy = useMotionValue(0);
  const reduce = useReducedMotion();
  const target = state.focused ? 1 : state.hoveredChipId ? 0.7 : 0;

  useEffect(() => {
    const controls = animate(energy, target, {
      duration: reduce ? 0 : 0.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [energy, target, reduce]);

  // "ready" fires from either signal — a chip selection OR text in the textarea.
  const ready = state.hasText || state.selectedChipId !== null;

  const tintColor = (() => {
    if (state.selectedChipId)
      return (
        SUGGESTIONS.find((s) => s.id === state.selectedChipId)?.themeColor ??
        null
      );
    if (state.hasText) return "var(--gold-primary)";
    return null;
  })();

  const setFocused = useCallback((v: boolean) => dispatch({ type: "SET_FOCUSED", value: v }), []);
  const setHoveredChip = useCallback((id: string | null) => dispatch({ type: "SET_HOVERED_CHIP", id }), []);
  const setSelectedChip = useCallback((id: string | null) => dispatch({ type: "SET_SELECTED_CHIP", id }), []);
  const setHasText = useCallback((v: boolean) => dispatch({ type: "SET_HAS_TEXT", value: v }), []);

  const startRitual = useCallback(() => {
    if (reduce) return;
    if (state.ritualActive) return;
    dispatch({ type: "SET_RITUAL_ACTIVE", value: true });
    setTimeout(() => {
      dispatch({ type: "SET_RITUAL_ACTIVE", value: false });
    }, 2800);
  }, [reduce, state.ritualActive]);

  const value = useMemo<SceneContextValue>(
    () => ({
      state,
      ready,
      energy,
      tintColor,
      setFocused,
      setHoveredChip,
      setSelectedChip,
      setHasText,
      startRitual,
    }),
    [
      state,
      ready,
      tintColor,
      setFocused,
      setHoveredChip,
      setSelectedChip,
      setHasText,
      startRitual,
    ],
  );

  return <SceneStateContext.Provider value={value}>{children}</SceneStateContext.Provider>;
}

export function useSceneState(): SceneContextValue {
  const ctx = useContext(SceneStateContext);
  if (!ctx) throw new Error("useSceneState must be used within SceneStateProvider");
  return ctx;
}

export function useSceneEnergy(): MotionValue<number> {
  return useSceneState().energy;
}
