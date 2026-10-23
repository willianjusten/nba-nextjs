import type { Game, GameStatus, Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { finalLabel, hasScore, periodLabel } from "@/app/lib/game/status";
import { strings } from "@/app/lib/strings";
import {
  formatNbaDate,
  formatNbaMonthDay,
  formatNbaWeekday,
  formatShortNbaDate,
} from "@/app/lib/time/nba-date";
import { formatTipOff } from "@/app/lib/time/tip-off";
import { readableTeamColors, type TeamSide } from "./team-colors";

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
  // The browser timezone; null while server rendering, where the viewer's timezone is unknown.
  timeZone: string | null;
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
  // Null only for a scheduled game until the browser timezone is known.
  statusLabel: string | null;
  channelLabel: string;
  metaLabel: string;
  // Only for games not yet played, where it sits on its own line so the channel isn't truncated.
  venueLabel: string | null;
  leadingSide: TeamSide | null;
  teamColors: Record<TeamSide, string>;
  showHighlights: boolean;
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

const META_SEPARATOR = " · ";
function statusLabelOf(game: Game, timeZone: string | null): string | null {
  const { status } = game;
  switch (status.kind) {
    case "scheduled":
      return timeZone
        ? formatTipOff(game.startTime, game.nbaDate, timeZone)
        : null;
    case "live":
      return `${periodLabel(status.period)} ${status.clock}`;
    case "halftime":
      return strings.gameStatus.halftime;
    case "final":
      return finalLabel(status.period);
    case "postponed":
    case "canceled":
      return strings.gameStatus.postponedShort;
  }
}

function metaLabelOf(game: Game, channelLabel: string) {
  const { status } = game;
  const parts = (() => {
    switch (status.kind) {
      case "live":
        return [periodLabel(status.period), status.clock, channelLabel];
      case "halftime":
        return [strings.gameStatus.halftime, channelLabel];
      case "final":
      case "scheduled":
      case "postponed":
      case "canceled":
        return [channelLabel];
    }
  })();
  return parts.join(META_SEPARATOR);
}

function leadingSideOf({ status, home, away }: Game): TeamSide | null {
  if (!hasScore(status) || home.score === away.score) return null;
  return home.score > away.score ? "home" : "away";
}

function cardOf(game: Game, timeZone: string | null): HomeCard {
  const channelLabel = game.broadcasts
    .map((broadcast) => broadcast.name)
    .join(META_SEPARATOR);

  return {
    game,
    statusLabel: statusLabelOf(game, timeZone),
    channelLabel,
    metaLabel: metaLabelOf(game, channelLabel),
    venueLabel: hasScore(game.status) ? null : game.venue,
    leadingSide: leadingSideOf(game),
    teamColors: readableTeamColors(game.home.team, game.away.team),
    showHighlights: game.status.kind === "final",
  };
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

function screenOf(
  query: ScoreboardQueryState,
  now: Date,
  timeZone: string | null,
): HomeScreen {
  switch (query.status) {
    case "loading":
      return { kind: "loading" };
    case "error":
      return { kind: "error" };
    case "success":
    case "stale": {
      const { games, nextGameDate } = query.scoreboard;
      if (games.length === 0) return { kind: "empty", nextGameDate };

      const cards = orderGames(games).map((game) => cardOf(game, timeZone));
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
  timeZone,
}: HomeViewInput): HomeView {
  const games =
    query.status === "success" || query.status === "stale"
      ? query.scoreboard.games
      : [];

  return {
    heading: headingOf(nbaDate),
    summary: games.length > 0 ? summarize(games) : null,
    screen: screenOf(query, now, timeZone),
  };
}
