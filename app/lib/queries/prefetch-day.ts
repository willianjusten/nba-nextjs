import type { NbaDate } from "@/app/lib/domain/nba-date";
import { dateRailRange } from "@/app/lib/home/home-view";
import { getServerQueryClient } from "@/app/lib/query/server";
import { gameCountsQueryOptions } from "./game-counts";
import { scoreboardQueryOptions } from "./scoreboard";
import { seasonCalendarQueryOptions } from "./season-calendar";

export function prefetchDayScoreboard(nbaDate: NbaDate) {
  const queryClient = getServerQueryClient();
  const { firstDate, lastDate } = dateRailRange(nbaDate);

  return Promise.all([
    // The calendar reads the scoreboard once it is cached, so the empty day renders with its next game link.
    queryClient
      .prefetchQuery(scoreboardQueryOptions(nbaDate))
      .then(() =>
        queryClient.prefetchQuery(seasonCalendarQueryOptions(nbaDate)),
      ),
    queryClient.prefetchQuery(gameCountsQueryOptions(firstDate, lastDate)),
  ]);
}
