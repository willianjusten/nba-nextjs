import type { Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
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
  };
}
