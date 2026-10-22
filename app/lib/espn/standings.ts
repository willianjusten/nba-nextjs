import type { Standings } from "@/app/lib/domain/standings";
import { mapConferenceStandings, mapSeason } from "./mappers";
import type { RawStandingsResponse } from "./raw-types";
import { espnGet } from "./transport";

const REGULAR_SEASON_TYPE_ID = "2";

// Always the regular season table, even during preseason or playoffs. Leaving out the season makes ESPN pick the current one.
export async function fetchStandings(): Promise<Standings> {
  const rawStandings = await espnGet<RawStandingsResponse>("standings", {
    searchParams: new URLSearchParams({ seasontype: REGULAR_SEASON_TYPE_ID }),
  });

  // A missing conferences list means ESPN sent something unexpected, which must not read as empty standings.
  if (!Array.isArray(rawStandings.children)) {
    throw new Error("ESPN standings response has no conferences list");
  }

  return {
    season: mapSeason(rawStandings, new Date()),
    conferences: rawStandings.children.map(mapConferenceStandings),
  };
}
