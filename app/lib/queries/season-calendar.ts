import { queryOptions } from "@tanstack/react-query";
import { fetchSeasonCalendar } from "@/app/lib/espn";

// The season's game days rarely change, so they are cached for an hour and never polled.
const SEASON_CALENDAR_STALE_MILLISECONDS = 60 * 60 * 1000;

export function seasonCalendarQueryOptions(seasonStartYear: number) {
  return queryOptions({
    queryKey: ["season-calendar", seasonStartYear],
    queryFn: () => fetchSeasonCalendar(seasonStartYear),
    staleTime: SEASON_CALENDAR_STALE_MILLISECONDS,
  });
}
