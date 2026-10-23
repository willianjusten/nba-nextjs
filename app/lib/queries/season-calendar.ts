import { queryOptions } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { scoreboardQueryOptions } from "./scoreboard";

// The season's game days rarely change, so they are cached for an hour and never polled.
const SEASON_CALENDAR_STALE_MILLISECONDS = 60 * 60 * 1000;

// Read from the day's scoreboard, which already carries the calendar, so it costs no request of its own.
export function seasonCalendarQueryOptions(nbaDate: NbaDate) {
  return queryOptions({
    queryKey: ["season-calendar", nbaDate],
    queryFn: async ({ client }) =>
      (await client.ensureQueryData(scoreboardQueryOptions(nbaDate)))
        .seasonCalendar,
    staleTime: SEASON_CALENDAR_STALE_MILLISECONDS,
  });
}
