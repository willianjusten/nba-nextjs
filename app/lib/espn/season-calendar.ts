import type { NbaDate } from "@/app/lib/domain/nba-date";
import { nbaDateOf } from "@/app/lib/time/nba-date";
import type { RawScoreboard } from "./raw-types";
import { espnGet } from "./transport";

// ESPN answers an offseason day with the season that just ended, so a season is read from its own first day.
const SEASON_FIRST_DAY = "1001";

export async function fetchSeasonCalendar(
  seasonStartYear: number,
): Promise<NbaDate[]> {
  const rawScoreboard = await espnGet<RawScoreboard>("seasonCalendar", {
    searchParams: new URLSearchParams({
      dates: `${seasonStartYear}${SEASON_FIRST_DAY}`,
    }),
  });

  // Without the calendar, ESPN sent something unexpected, which must not read as a season without games.
  const calendar = rawScoreboard.leagues?.[0]?.calendar;
  if (!calendar) {
    throw new Error(`ESPN scoreboard has no calendar for ${seasonStartYear}`);
  }

  // NbaDate strings are YYYY-MM-DD, so string order is calendar order.
  return [...new Set(calendar.map(nbaDateOf))].sort();
}
