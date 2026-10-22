import type {
  Game,
  GameCompetitor,
  GameStatus,
  SeasonType,
  Team,
} from "@/app/lib/domain/game";
import { nbaDateOf } from "@/app/lib/time/nba-date";
import type {
  RawCompetitor,
  RawEvent,
  RawSeason,
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

export function mapGame(event: RawEvent): Game {
  return {
    id: event.id,
    startTime: event.date,
    nbaDate: nbaDateOf(event.date),
    seasonYear: event.season.year,
    seasonType: mapSeasonType(event.season),
    status: mapStatus(event.status),
    home: mapCompetitor(findCompetitor(event, "home")),
    away: mapCompetitor(findCompetitor(event, "away")),
  };
}
