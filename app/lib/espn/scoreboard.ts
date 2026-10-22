import type { Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { mapGame } from "./mappers";
import type { RawScoreboard } from "./raw-types";
import { espnGet } from "./transport";

export async function fetchScoreboard(nbaDate: NbaDate): Promise<Scoreboard> {
  const espnDate = nbaDate.replaceAll("-", "");
  const rawScoreboard = await espnGet<RawScoreboard>(
    "scoreboard",
    new URLSearchParams({ dates: espnDate }),
  );

  return {
    nbaDate,
    games: (rawScoreboard.events ?? []).map(mapGame),
  };
}
