import type {
  Broadcast,
  BroadcastMarket,
  Game,
  GameCompetitor,
  GameStatus,
  PlayoffSeries,
  SeasonType,
  Team,
} from "@/app/lib/domain/game";
import { nbaDateOf } from "@/app/lib/time/nba-date";
import type {
  RawCompetition,
  RawCompetitor,
  RawEvent,
  RawSeason,
  RawSeries,
  RawStatus,
  RawTeam,
} from "./raw-types";

const SEASON_TYPE_BY_ID: Record<number, SeasonType> = {
  1: "preseason",
  2: "regular",
  3: "postseason",
  5: "play-in",
};

const SEASON_TYPE_BY_SLUG: Record<string, SeasonType> = {
  preseason: "preseason",
  "regular-season": "regular",
  "post-season": "postseason",
  "play-in-season": "play-in",
};

function mapSeasonType(season: RawSeason): SeasonType {
  return (
    SEASON_TYPE_BY_ID[season.type] ??
    (season.slug ? SEASON_TYPE_BY_SLUG[season.slug] : undefined) ??
    "regular"
  );
}

function mapStatus(status: RawStatus): GameStatus {
  switch (status.type.name) {
    case "STATUS_POSTPONED":
      return { kind: "postponed" };
    case "STATUS_CANCELED":
      return { kind: "canceled" };
    case "STATUS_HALFTIME":
      return { kind: "halftime", period: status.period };
  }

  switch (status.type.state) {
    case "in":
      return {
        kind: "live",
        period: status.period,
        clock: status.displayClock,
      };
    case "post":
      return { kind: "final", period: status.period };
    case "pre":
      return { kind: "scheduled" };
    default:
      // Guessing "scheduled" here would show a game as not started when ESPN sent something unexpected.
      throw new Error(`Unknown ESPN game state: ${status.type.state}`);
  }
}

function mapTeam(team: RawTeam): Team {
  return {
    id: team.id,
    abbreviation: team.abbreviation,
    name: team.name,
    displayName: team.displayName,
    location: team.location,
    color: team.color ?? null,
    logoUrl: team.logo,
  };
}

function mapCompetitor(competitor: RawCompetitor): GameCompetitor {
  const score = Number(competitor.score);

  return {
    team: mapTeam(competitor.team),
    score: Number.isFinite(score) ? score : 0,
    winner: competitor.winner ?? false,
  };
}

function findCompetitor(event: RawEvent, side: RawCompetitor["homeAway"]) {
  const competitor = event.competitions[0]?.competitors.find(
    (candidate) => candidate.homeAway === side,
  );
  if (!competitor) {
    throw new Error(`ESPN event ${event.id} has no ${side} competitor`);
  }
  return competitor;
}

const MARKET_PRIORITY: BroadcastMarket[] = ["national", "home", "away"];
// Product decision: only these channels are shown, local networks and team apps are left out.
const SUPPORTED_BROADCAST_NAMES = new Set([
  "espn",
  "prime video",
  "nba league pass",
]);

function toMarket(rawMarket: string): BroadcastMarket | undefined {
  const market = rawMarket.toLowerCase();
  return MARKET_PRIORITY.find((candidate) => candidate === market);
}

function mapBroadcasts(competition: RawCompetition | undefined): Broadcast[] {
  const listedBroadcasts = (competition?.broadcasts ?? []).flatMap(
    (broadcast) => {
      const market = toMarket(broadcast.market);
      return market ? broadcast.names.map((name) => ({ name, market })) : [];
    },
  );
  const usGeoBroadcasts = (competition?.geoBroadcasts ?? []).flatMap(
    (broadcast) => {
      const market = toMarket(broadcast.market.type);
      const isUs = (broadcast.region ?? "us") === "us";
      return market && isUs
        ? [{ name: broadcast.media.shortName, market }]
        : [];
    },
  );

  const broadcastByNormalizedName = new Map<string, Broadcast>();
  for (const market of MARKET_PRIORITY) {
    for (const broadcast of [...listedBroadcasts, ...usGeoBroadcasts]) {
      const key = broadcast.name.toLowerCase();
      if (
        broadcast.market === market &&
        SUPPORTED_BROADCAST_NAMES.has(key) &&
        !broadcastByNormalizedName.has(key)
      ) {
        broadcastByNormalizedName.set(key, broadcast);
      }
    }
  }
  return [...broadcastByNormalizedName.values()];
}

function mapSeries(
  series: RawSeries | undefined,
  homeTeamId: string,
  awayTeamId: string,
): PlayoffSeries | null {
  if (series?.type !== "playoff") {
    return null;
  }
  const winsOf = (teamId: string) =>
    series.competitors.find((competitor) => competitor.id === teamId)?.wins ??
    0;

  return {
    summary: series.summary,
    completed: series.completed,
    totalGames: series.totalCompetitions,
    homeWins: winsOf(homeTeamId),
    awayWins: winsOf(awayTeamId),
  };
}

export function mapGame(event: RawEvent): Game {
  const competition = event.competitions[0];
  const home = findCompetitor(event, "home");
  const away = findCompetitor(event, "away");

  return {
    id: event.id,
    startTime: event.date,
    nbaDate: nbaDateOf(event.date),
    seasonYear: event.season.year,
    seasonType: mapSeasonType(event.season),
    status: mapStatus(event.status),
    home: mapCompetitor(home),
    away: mapCompetitor(away),
    broadcasts: mapBroadcasts(competition),
    series: mapSeries(competition?.series, home.team.id, away.team.id),
  };
}
