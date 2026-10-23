import { queryOptions } from "@tanstack/react-query";
import { fetchGameSummary } from "@/app/lib/espn";

export function gameSummaryQueryOptions(gameId: string) {
  return queryOptions({
    queryKey: ["game-summary", gameId],
    queryFn: () => fetchGameSummary(gameId),
  });
}
