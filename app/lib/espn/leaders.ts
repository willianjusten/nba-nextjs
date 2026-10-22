import "server-only";
import type { LeaderCategory, LeaderStat } from "@/app/lib/domain/leaders";
import { REGULAR_SEASON_TYPE_ID } from "./config";
import { mapLeader } from "./mappers";
import type {
  RawCurrentSeason,
  RawLeaderAthlete,
  RawLeaderCategory,
  RawLeadersResponse,
} from "./raw-types";
import { espnGet, espnGetRef, EspnRequestError } from "./transport";

const LEADERS_PER_CATEGORY = 5;
const NOT_FOUND_STATUS = 404;
const NO_STATS_MESSAGE = "No stats found.";

const CATEGORY_NAME_BY_STAT: Record<LeaderStat, string> = {
  points: "pointsPerGame",
  rebounds: "reboundsPerGame",
  assists: "assistsPerGame",
};

const LEADER_STATS = Object.keys(CATEGORY_NAME_BY_STAT) as LeaderStat[];

async function fetchRegularSeasonLeaders(
  seasonYear: number,
): Promise<RawLeadersResponse | null> {
  try {
    return await espnGet<RawLeadersResponse>("leaders", {
      pathParams: {
        seasonYear: String(seasonYear),
        seasonTypeId: REGULAR_SEASON_TYPE_ID,
      },
      searchParams: new URLSearchParams({
        limit: String(LEADERS_PER_CATEGORY),
      }),
    });
  } catch (error) {
    // ESPN answers 404 "No stats found." until the season's first regular season game is played. Any other 404 is a real error.
    if (
      error instanceof EspnRequestError &&
      error.status === NOT_FOUND_STATUS &&
      error.responseText.includes(NO_STATS_MESSAGE)
    ) {
      return null;
    }
    throw error;
  }
}

function findRawCategory(
  rawLeaders: RawLeadersResponse,
  stat: LeaderStat,
): RawLeaderCategory {
  const categoryName = CATEGORY_NAME_BY_STAT[stat];
  const rawCategory = rawLeaders.categories?.find(
    (category) => category.name === categoryName,
  );

  // A missing category means ESPN changed its format, which must not read as a season without leaders.
  if (!rawCategory) {
    throw new Error(`ESPN leaders response has no ${categoryName} category`);
  }

  return rawCategory;
}

async function resolveAthletes(refs: string[]) {
  const uniqueRefs = [...new Set(refs)];
  const athletes = await Promise.all(
    uniqueRefs.map((ref) => espnGetRef<RawLeaderAthlete>(ref)),
  );

  return new Map(uniqueRefs.map((ref, index) => [ref, athletes[index]]));
}

// Regular season points, rebounds, and assists leaders of the current season, with athletes resolved. Server only, so the browser never follows ESPN's $ref links itself.
export async function fetchLeaders(): Promise<LeaderCategory[]> {
  const { year } = await espnGet<RawCurrentSeason>("currentSeason");
  const rawLeaders = await fetchRegularSeasonLeaders(year);

  if (!rawLeaders) {
    return LEADER_STATS.map((stat) => ({ stat, leaders: [] }));
  }

  const topRawCategories = LEADER_STATS.map((stat) => {
    const rawCategory = findRawCategory(rawLeaders, stat);
    return {
      stat,
      topRawLeaders: rawCategory.leaders.slice(0, LEADERS_PER_CATEGORY),
    };
  });
  const athletesByRef = await resolveAthletes(
    topRawCategories.flatMap(({ topRawLeaders }) =>
      topRawLeaders.map((rawLeader) => rawLeader.athlete.$ref),
    ),
  );

  return topRawCategories.map(({ stat, topRawLeaders }) => ({
    stat,
    leaders: topRawLeaders.map((rawLeader) => {
      const athlete = athletesByRef.get(rawLeader.athlete.$ref);
      if (!athlete) {
        throw new Error(`Unresolved ESPN athlete: ${rawLeader.athlete.$ref}`);
      }
      return mapLeader(rawLeader, athlete);
    }),
  }));
}
