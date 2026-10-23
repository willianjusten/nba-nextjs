import { queryOptions } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { fetchScoreboard } from "@/app/lib/espn";

export function scoreboardQueryOptions(nbaDate: NbaDate) {
  return queryOptions({
    queryKey: ["scoreboard", nbaDate],
    queryFn: () => fetchScoreboard(nbaDate),
  });
}
