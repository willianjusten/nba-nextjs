import { useEffect, useReducer } from "react";
import {
  millisecondsUntilPollingWindow,
  NO_POLLING,
  pollingInterval,
  type PolledGame,
  type PollingContext,
} from "@/app/lib/realtime/polling-policy";

type PolledQuery<Data> = { state: { data: Data | undefined } };

// Query options that poll while the games in the data are live or about to start.
export function livePollingOptions<Data>(
  gamesOf: (data: Data | undefined) => PolledGame[],
  context: PollingContext,
) {
  const intervalFor = (query: PolledQuery<Data>) =>
    pollingInterval({
      games: gamesOf(query.state.data),
      now: new Date(),
      // TanStack also evaluates refetchInterval while rendering on the server, where there is no document and no polling.
      isTabVisible:
        typeof document !== "undefined" &&
        document.visibilityState === "visible",
      context,
    });

  return {
    refetchInterval: intervalFor,
    // "always" ignores staleTime, so returning to the tab during live games refreshes scores immediately.
    refetchOnWindowFocus: (query: PolledQuery<Data>) =>
      intervalFor(query) === NO_POLLING ? true : ("always" as const),
  };
}

// TanStack only re-evaluates refetchInterval on fetches and renders, so a render is scheduled for when the pre-game window opens.
export function usePollingWindowRecheck(games: PolledGame[] | undefined) {
  const [, recheckPolling] = useReducer(
    (pollingCheckCount: number) => pollingCheckCount + 1,
    0,
  );

  useEffect(() => {
    if (!games) return;
    const waitMilliseconds = millisecondsUntilPollingWindow(games, new Date());
    if (waitMilliseconds === null) return;

    const timeoutId = setTimeout(recheckPolling, waitMilliseconds);
    return () => clearTimeout(timeoutId);
  }, [games]);
}
