"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { SUGGESTIONS } from "./suggestions";

export type SceneState = {
  focused: boolean;
  hoveredChipId: string | null;
  selectedChipId: string | null;
  hasText: boolean;
};

type SceneAction =
  | { type: "SET_FOCUSED"; value: boolean }
  | { type: "SET_HOVERED_CHIP"; id: string | null }
  | { type: "SET_SELECTED_CHIP"; id: string | null }
  | { type: "SET_HAS_TEXT"; value: boolean };

const initialState: SceneState = {
  focused: false,
  hoveredChipId: null,
  selectedChipId: null,
  hasText: false,
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
};

const SceneStateContext = createContext<SceneContextValue | null>(null);

export function SceneStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const energy = useMotionValue(0);

  // Re-evaluate energy whenever focused/hovered change
  // (called inside render — fine because useMotionValue.set is a noop if unchanged)
  const target = state.focused ? 1 : state.hoveredChipId ? 0.7 : 0;
  if (energy.get() !== target) energy.set(target);

  const ready = state.hasText && state.selectedChipId !== null;

  const tintColor = (() => {
    // hovered overrides selected for a "previewing" feel
    const id = state.hoveredChipId ?? state.selectedChipId;
    if (!id) return null;
    return SUGGESTIONS.find((s) => s.id === id)?.themeColor ?? null;
  })();

  const setFocused = useCallback((v: boolean) => dispatch({ type: "SET_FOCUSED", value: v }), []);
  const setHoveredChip = useCallback((id: string | null) => dispatch({ type: "SET_HOVERED_CHIP", id }), []);
  const setSelectedChip = useCallback((id: string | null) => dispatch({ type: "SET_SELECTED_CHIP", id }), []);
  const setHasText = useCallback((v: boolean) => dispatch({ type: "SET_HAS_TEXT", value: v }), []);

  const value = useMemo<SceneContextValue>(
    () => ({ state, ready, energy, tintColor, setFocused, setHoveredChip, setSelectedChip, setHasText }),
    [state, ready, tintColor, setFocused, setHoveredChip, setSelectedChip, setHasText],
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
