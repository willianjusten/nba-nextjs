import type { Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { nbaDateOf } from "@/app/lib/time/nba-date";
import { mapGame } from "./mappers";
import type { RawScoreboard } from "./raw-types";
import { espnGet } from "./transport";

export async function fetchScoreboard(nbaDate: NbaDate): Promise<Scoreboard> {
  const espnDate = nbaDate.replaceAll("-", "");
  const rawScoreboard = await espnGet<RawScoreboard>("scoreboard", {
    searchParams: new URLSearchParams({ dates: espnDate }),
  });

  // A missing events list means ESPN sent something unexpected, which must not read as a day without games.
  if (!Array.isArray(rawScoreboard.events)) {
    throw new Error(`ESPN scoreboard for ${nbaDate} has no events list`);
  }

  return {
    nbaDate,
    games: rawScoreboard.events.map(mapGame),
    nextGameDate: nextGameDateOf(rawScoreboard, nbaDate),
  };
}

function nextGameDateOf(
  rawScoreboard: RawScoreboard,
  nbaDate: NbaDate,
): NbaDate | null {
  const gameDates = (rawScoreboard.leagues?.[0]?.calendar ?? []).map(nbaDateOf);
  // NbaDate strings are YYYY-MM-DD, so string order is calendar order.
  return gameDates.filter((gameDate) => gameDate > nbaDate).sort()[0] ?? null;
}
