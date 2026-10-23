import type { NbaDate } from "@/app/lib/domain/nba-date";
import { dateRailRange } from "@/app/lib/home/home-view";
import { getServerQueryClient } from "@/app/lib/query/server";
import { seasonStartYearOf } from "@/app/lib/season/season-year";
import { gameCountsQueryOptions } from "./game-counts";
import { scoreboardQueryOptions } from "./scoreboard";
import { seasonCalendarQueryOptions } from "./season-calendar";

export function prefetchDayScoreboard(nbaDate: NbaDate) {
  const queryClient = getServerQueryClient();
  const { firstDate, lastDate } = dateRailRange(nbaDate);

  return Promise.all([
    queryClient.prefetchQuery(scoreboardQueryOptions(nbaDate)),
    // Prefetched so an empty day renders with its next game link.
    queryClient.prefetchQuery(
      seasonCalendarQueryOptions(seasonStartYearOf(nbaDate)),
    ),
    queryClient.prefetchQuery(gameCountsQueryOptions(firstDate, lastDate)),
  ]);
}
