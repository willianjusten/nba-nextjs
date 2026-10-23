import type { NbaDate } from "@/app/lib/domain/nba-date";
import { dateRailRange } from "@/app/lib/home/home-view";
import { getServerQueryClient } from "@/app/lib/query/server";
import { gameCountsQueryOptions } from "./game-counts";
import { scoreboardQueryOptions } from "./scoreboard";

export function prefetchDayScoreboard(nbaDate: NbaDate) {
  const queryClient = getServerQueryClient();
  const { firstDate, lastDate } = dateRailRange(nbaDate);

  return Promise.all([
    queryClient.prefetchQuery(scoreboardQueryOptions(nbaDate)),
    queryClient.prefetchQuery(gameCountsQueryOptions(firstDate, lastDate)),
  ]);
}
