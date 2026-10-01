export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_META: Record<Season, { label: string }> = {
  spring: { label: "Spring" },
  summer: { label: "Summer" },
  autumn: { label: "Autumn" },
  winter: { label: "Winter" },
};

/** Meteorological seasons for the northern hemisphere. */
export function seasonFor(date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}
