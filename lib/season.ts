export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_META: Record<Season, { kanji: string; label: string }> = {
  spring: { kanji: "春", label: "Spring" },
  summer: { kanji: "夏", label: "Summer" },
  autumn: { kanji: "秋", label: "Autumn" },
  winter: { kanji: "冬", label: "Winter" },
};

/** Meteorological seasons for the northern hemisphere. */
export function seasonFor(date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}
