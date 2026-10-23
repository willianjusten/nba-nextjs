import { queryOptions } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { fetchGameCounts } from "@/app/lib/espn";

// The schedule rarely changes within a day, so counts are cached for an hour and never polled.
const GAME_COUNTS_STALE_MILLISECONDS = 60 * 60 * 1000;

export function gameCountsQueryOptions(firstDate: NbaDate, lastDate: NbaDate) {
  return queryOptions({
    queryKey: ["game-counts", firstDate, lastDate],
    queryFn: () => fetchGameCounts(firstDate, lastDate),
    staleTime: GAME_COUNTS_STALE_MILLISECONDS,
  });
}
