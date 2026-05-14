export interface Suggestion {
  id: string;
  label: string;
  text: string;
}

export const SUGGESTIONS: readonly Suggestion[] = [
  { id: "love",   label: "ความรัก",   text: "ความรักของฉันตอนนี้เป็นอย่างไร?" },
  { id: "work",   label: "การงาน",    text: "การงานในช่วงนี้จะเป็นอย่างไร?" },
  { id: "money",  label: "การเงิน",   text: "การเงินของฉันในช่วงนี้?" },
  { id: "health", label: "สุขภาพ",    text: "สุขภาพของฉันต้องระวังอะไร?" },
  { id: "family", label: "ครอบครัว",  text: "ความสัมพันธ์ในครอบครัว?" },
  { id: "luck",   label: "โชค",       text: "โชคลาภในช่วงนี้?" },
  { id: "enemy",  label: "ศัตรู",     text: "ฉันต้องระวังใครเป็นพิเศษ?" },
  { id: "future", label: "อนาคต",     text: "อนาคตของฉันจะเป็นอย่างไร?" },
] as const;
