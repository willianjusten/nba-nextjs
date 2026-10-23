import type { Game, SeasonType } from "@/app/lib/domain/game";

const POSTSEASON_TYPES: ReadonlySet<SeasonType> = new Set([
  "play-in",
  "postseason",
]);

export function isPostseason(
  games: ReadonlyArray<Pick<Game, "seasonType">>,
  forcedOn: boolean,
) {
  return (
    forcedOn || games.some((game) => POSTSEASON_TYPES.has(game.seasonType))
  );
}

export function isPostseasonForced(overrideValue: string | undefined) {
  return overrideValue === "true" || overrideValue === "1";
}

export function isPostseasonForcedByEnv() {
  return isPostseasonForced(process.env.FORCE_PLAYOFFS_TAB);
}
