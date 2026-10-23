import type { NbaDate } from "@/app/lib/domain/nba-date";

// Seasons tip off in October and end by June, so July starts the offseason that leads into the next one.
const FIRST_MONTH_OF_SEASON_YEAR = 7;

export function seasonStartYearOf(nbaDate: NbaDate): number {
  const [year, month] = nbaDate.split("-").map(Number);
  return month >= FIRST_MONTH_OF_SEASON_YEAR ? year : year - 1;
}
