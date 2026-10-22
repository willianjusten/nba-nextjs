import type { GameSummary } from "@/app/lib/domain/game-summary";
import { mapGameSummary } from "./mappers";
import type { RawSummary } from "./raw-types";
import { espnGet } from "./transport";

export async function fetchGameSummary(gameId: string): Promise<GameSummary> {
  const rawSummary = await espnGet<RawSummary>("summary", {
    searchParams: new URLSearchParams({ event: gameId }),
  });
  return mapGameSummary(rawSummary);
}
