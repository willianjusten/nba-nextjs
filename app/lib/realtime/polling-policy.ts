import type { Game } from "@/app/lib/domain/game";

export type PollingContext = "games-list" | "game-detail";

// Matches TanStack Query's refetchInterval, where false turns polling off.
export const NO_POLLING = false;

// Matches the max-age ESPN's CDN sets on each endpoint (6 s scoreboard, 8 s summary); polling faster only returns the same cached copy.
const POLLING_INTERVAL_BY_CONTEXT: Record<PollingContext, number> = {
  "games-list": 6_000,
  "game-detail": 8_000,
};

// Polling starts this long before tip-off so the first live score is not missed.
const PRE_GAME_WINDOW_MS = 10 * 60 * 1000;

export type PolledGame = Pick<Game, "status" | "startTime">;

type PollingInput = {
  games: PolledGame[];
  now: Date;
  isTabVisible: boolean;
  context: PollingContext;
};

function millisecondsUntilGameWindow(game: PolledGame, now: Date) {
  return (
    new Date(game.startTime).getTime() - PRE_GAME_WINDOW_MS - now.getTime()
  );
}

function needsPolling(game: PolledGame, now: Date) {
  switch (game.status.kind) {
    case "live":
    case "halftime":
      return true;
    case "scheduled":
      return millisecondsUntilGameWindow(game, now) <= 0;
    default:
      return false;
  }
}

export function pollingInterval({
  games,
  now,
  isTabVisible,
  context,
}: PollingInput): number | typeof NO_POLLING {
  if (!isTabVisible) return NO_POLLING;
  if (!games.some((game) => needsPolling(game, now))) return NO_POLLING;

  return POLLING_INTERVAL_BY_CONTEXT[context];
}

// When nothing needs polling yet, tells the caller when to check again so polling can start before the next tip-off.
export function millisecondsUntilPollingWindow(
  games: PolledGame[],
  now: Date,
): number | null {
  const millisecondsUntilEachWindow = games
    .filter((game) => game.status.kind === "scheduled")
    .map((game) => millisecondsUntilGameWindow(game, now));

  if (
    millisecondsUntilEachWindow.length === 0 ||
    millisecondsUntilEachWindow.some((wait) => wait <= 0)
  ) {
    return null;
  }
  return Math.min(...millisecondsUntilEachWindow);
}
