import type { Game, GameStatus, Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  formatNbaDate,
  formatNbaMonthDay,
  formatNbaWeekday,
  formatShortNbaDate,
} from "@/app/lib/time/nba-date";

const MILLISECONDS_PER_MINUTE = 60_000;

export type ScoreboardQueryState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; scoreboard: Scoreboard }
  // A refetch failed, so the last scoreboard is kept along with when it was fetched.
  | { status: "stale"; scoreboard: Scoreboard; updatedAt: number };

export type HomeViewInput = {
  nbaDate: NbaDate;
  query: ScoreboardQueryState;
  now: Date;
};

export type DateHeading = {
  label: string;
  weekday: string;
  monthDay: string;
  compact: string;
};

export type GamesSummary = {
  total: number;
  live: number;
  final: number;
};

export type HomeCard = {
  game: Game;
};

export type HomeScreen =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "empty"; nextGameDate: NbaDate | null }
  | { kind: "games"; cards: HomeCard[] }
  | { kind: "stale"; cards: HomeCard[]; minutesAgo: number };

export type HomeView = {
  heading: DateHeading;
  // Null until there are games to count, so a failed or pending request never reads as "0 games".
  summary: GamesSummary | null;
  screen: HomeScreen;
};

type StatusGroup = "live" | "scheduled" | "final" | "off";

const STATUS_GROUP_ORDER: StatusGroup[] = ["live", "scheduled", "final", "off"];

function statusGroupOf(status: GameStatus): StatusGroup {
  switch (status.kind) {
    case "live":
    case "halftime":
      return "live";
    case "scheduled":
      return "scheduled";
    case "final":
      return "final";
    case "postponed":
    case "canceled":
      return "off";
  }
}

function orderGames(games: Game[]): Game[] {
  const groupRank = (game: Game) =>
    STATUS_GROUP_ORDER.indexOf(statusGroupOf(game.status));

  return games.toSorted(
    (first, second) =>
      groupRank(first) - groupRank(second) ||
      Date.parse(first.startTime) - Date.parse(second.startTime),
  );
}

function summarize(games: Game[]): GamesSummary {
  const countOf = (group: StatusGroup) =>
    games.filter((game) => statusGroupOf(game.status) === group).length;

  return {
    total: games.length,
    live: countOf("live"),
    final: countOf("final"),
  };
}

function headingOf(nbaDate: NbaDate): DateHeading {
  return {
    label: formatNbaDate(nbaDate),
    weekday: formatNbaWeekday(nbaDate),
    monthDay: formatNbaMonthDay(nbaDate),
    compact: formatShortNbaDate(nbaDate),
  };
}

function screenOf(query: ScoreboardQueryState, now: Date): HomeScreen {
  switch (query.status) {
    case "loading":
      return { kind: "loading" };
    case "error":
      return { kind: "error" };
    case "success":
    case "stale": {
      const { games, nextGameDate } = query.scoreboard;
      if (games.length === 0) return { kind: "empty", nextGameDate };

      const cards = orderGames(games).map((game) => ({ game }));
      if (query.status === "success") return { kind: "games", cards };

      const minutesAgo = Math.max(
        1,
        Math.round((now.getTime() - query.updatedAt) / MILLISECONDS_PER_MINUTE),
      );
      return { kind: "stale", cards, minutesAgo };
    }
  }
}

export function buildHomeView({
  nbaDate,
  query,
  now,
}: HomeViewInput): HomeView {
  const games =
    query.status === "success" || query.status === "stale"
      ? query.scoreboard.games
      : [];

  return {
    heading: headingOf(nbaDate),
    summary: games.length > 0 ? summarize(games) : null,
    screen: screenOf(query, now),
  };
}
