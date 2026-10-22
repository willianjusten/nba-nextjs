import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  millisecondsUntilPollingWindow,
  NO_POLLING,
  pollingInterval,
} from "@/app/lib/realtime/polling-policy";
import { scoreboardQueryOptions } from "./scoreboard";

function scoreboardPollingInterval(scoreboard: Scoreboard | undefined) {
  return pollingInterval({
    games: scoreboard?.games ?? [],
    now: new Date(),
    // TanStack also evaluates refetchInterval while rendering on the server, where there is no document and no polling.
    isTabVisible:
      typeof document !== "undefined" && document.visibilityState === "visible",
    context: "games-list",
  });
}

export function useScoreboard(nbaDate: NbaDate) {
  const [, recheckPolling] = useReducer(
    (pollingCheckCount: number) => pollingCheckCount + 1,
    0,
  );

  const scoreboardQuery = useQuery({
    ...scoreboardQueryOptions(nbaDate),
    refetchInterval: (query) => scoreboardPollingInterval(query.state.data),
    // "always" ignores staleTime, so returning to the tab during live games refreshes scores immediately.
    refetchOnWindowFocus: (query) =>
      scoreboardPollingInterval(query.state.data) === NO_POLLING
        ? true
        : "always",
  });

  const games = scoreboardQuery.data?.games;

  // TanStack only re-evaluates refetchInterval on fetches and renders, so a render is scheduled for when the pre-game window opens.
  useEffect(() => {
    if (!games) return;
    const waitMilliseconds = millisecondsUntilPollingWindow(games, new Date());
    if (waitMilliseconds === null) return;

    const timeoutId = setTimeout(recheckPolling, waitMilliseconds);
    return () => clearTimeout(timeoutId);
  }, [games]);

  return scoreboardQuery;
}
