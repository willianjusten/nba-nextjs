import type {
  Game,
  GameCounts,
  GameStatus,
  Scoreboard,
} from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  finalLabel,
  hasScore,
  isInProgress,
  periodLabel,
} from "@/app/lib/game/status";
import { strings } from "@/app/lib/strings";
import {
  addDaysToNbaDate,
  addMonthsToNbaMonth,
  formatNbaDate,
  formatNbaDayNumber,
  formatNbaMonthDay,
  formatNbaMonthYear,
  formatNbaWeekday,
  formatShortNbaDate,
  formatShortNbaWeekday,
  nbaDayOfWeek,
  parseNbaDate,
} from "@/app/lib/time/nba-date";
import { formatTipOff } from "@/app/lib/time/tip-off";
import { readableTeamColors, type TeamSide } from "./team-colors";

const MILLISECONDS_PER_MINUTE = 60_000;
// Dates further out are reached through the calendar instead of the rail.
const RAIL_DAYS_PER_SIDE = 7;
const GAMES_PATH_PREFIX = "/games/";

export type ScoreboardQueryState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; scoreboard: Scoreboard }
  // A refetch failed, so the last scoreboard is kept along with when it was fetched.
  | { status: "stale"; scoreboard: Scoreboard; updatedAt: number };

export type HomeViewInput = {
  selectedDate: NbaDate;
  // The date the page opened with, or the last date picked off the rail; the rail stays centered on it while days on it are selected.
  railCenterDate: NbaDate;
  // The current NBA date, which lives at "/" instead of its own games page.
  today: NbaDate;
  query: ScoreboardQueryState;
  filter: GameFilter;
  gameCounts: GameCounts | null;
  // Every game day of the selected date's season, the offseason counting toward the next one; null until it loads.
  seasonCalendar: NbaDate[] | null;
  now: Date;
  // The browser timezone; null while server rendering, where the viewer's timezone is unknown.
  timeZone: string | null;
};

export type GameFilter = "all" | "live" | "final" | "upcoming";

export type GameFilterOption = {
  filter: GameFilter;
  label: string;
  isSelected: boolean;
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

export type TeamWinProbability = {
  abbreviation: string;
  // Whole percent; both sides add up to 100.
  percent: number;
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
  // Both are live only, and null when ESPN sends nothing to show.
  winProbability: Record<TeamSide, TeamWinProbability> | null;
  topScorerLabel: string | null;
};

export type RailDay = {
  nbaDate: NbaDate;
  href: string;
  weekday: string;
  dayNumber: string;
  // The full date plus the count, read in place of the pill's abbreviated text.
  label: string;
  isSelected: boolean;
  // Both null until the counts load, so a pending or failed request never reads as "No games".
  gameCount: number | null;
  countLabel: string | null;
  hasGames: boolean;
};

export type DateRailView = {
  days: RailDay[];
};

export type NextGameDay = {
  nbaDate: NbaDate;
  href: string;
  label: string;
};

export type HomeScreen =
  | { kind: "loading" }
  | { kind: "error" }
  // The next game day is null once the season has none left, or while its calendar is unknown.
  | { kind: "empty"; nextGameDay: NextGameDay | null }
  // The message is set only when the day has games but none match the filter.
  | { kind: "games"; cards: HomeCard[]; emptyFilterMessage: string | null }
  | {
      kind: "stale";
      cards: HomeCard[];
      emptyFilterMessage: string | null;
      minutesAgo: number;
    };

export type HomeView = {
  heading: DateHeading;
  dateRail: DateRailView;
  // Null until there are games to count, so a failed or pending request never reads as "0 games".
  summary: GamesSummary | null;
  // Null until there are games, so a pending or failed request offers nothing to filter.
  filters: GameFilterOption[] | null;
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

const GAME_FILTERS: GameFilter[] = ["all", "live", "final", "upcoming"];

// Postponed and canceled games match no filter but All.
function matchesFilter(game: Game, filter: GameFilter) {
  const group = statusGroupOf(game.status);
  switch (filter) {
    case "all":
      return true;
    case "live":
    case "final":
      return group === filter;
    case "upcoming":
      return group === "scheduled";
  }
}

function filterOptionsOf(selectedFilter: GameFilter): GameFilterOption[] {
  return GAME_FILTERS.map((filter) => ({
    filter,
    label: strings.gameFilters[filter],
    isSelected: filter === selectedFilter,
  }));
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

function winProbabilityOf({
  status,
  homeWinProbability,
  home,
  away,
}: Game): HomeCard["winProbability"] {
  if (!isInProgress(status) || homeWinProbability === null) return null;

  const homePercent = Math.round(homeWinProbability * 100);
  return {
    away: { abbreviation: away.team.abbreviation, percent: 100 - homePercent },
    home: { abbreviation: home.team.abbreviation, percent: homePercent },
  };
}

function topScorerLabelOf({ status, topScorer }: Game) {
  if (!isInProgress(status) || !topScorer) return null;

  // ESPN separates the stats with commas, e.g. "28 PTS, 7 REB".
  const statLine =
    topScorer.statLine?.replaceAll(", ", " ") ??
    strings.gameCard.points(topScorer.points);
  return [topScorer.shortName, statLine].join(META_SEPARATOR);
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
    winProbability: winProbabilityOf(game),
    topScorerLabel: topScorerLabelOf(game),
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

function nextGameDayOf(
  selectedDate: NbaDate,
  today: NbaDate,
  seasonCalendar: NbaDate[] | null,
): NextGameDay | null {
  // NbaDate strings are YYYY-MM-DD, so string order is calendar order.
  const nextGameDate = seasonCalendar?.find(
    (gameDate) => gameDate > selectedDate,
  );
  if (!nextGameDate) return null;

  return {
    nbaDate: nextGameDate,
    href: hrefOf(nextGameDate, today),
    label: formatShortNbaDate(nextGameDate),
  };
}

function screenOf({
  query,
  filter,
  selectedDate,
  today,
  seasonCalendar,
  now,
  timeZone,
}: HomeViewInput): HomeScreen {
  switch (query.status) {
    case "loading":
      return { kind: "loading" };
    case "error":
      return { kind: "error" };
    case "success":
    case "stale": {
      const { games } = query.scoreboard;
      if (games.length === 0) {
        return {
          kind: "empty",
          nextGameDay: nextGameDayOf(selectedDate, today, seasonCalendar),
        };
      }

      const cards = orderGames(games)
        .filter((game) => matchesFilter(game, filter))
        .map((game) => cardOf(game, timeZone));
      const emptyFilterMessage =
        cards.length === 0
          ? strings.gameFilters.empty[filter](formatShortNbaDate(selectedDate))
          : null;
      if (query.status === "success") {
        return { kind: "games", cards, emptyFilterMessage };
      }

      const minutesAgo = Math.max(
        1,
        Math.round((now.getTime() - query.updatedAt) / MILLISECONDS_PER_MINUTE),
      );
      return { kind: "stale", cards, emptyFilterMessage, minutesAgo };
    }
  }
}

export function dateRailRange(nbaDate: NbaDate) {
  return {
    firstDate: addDaysToNbaDate(nbaDate, -RAIL_DAYS_PER_SIDE),
    lastDate: addDaysToNbaDate(nbaDate, RAIL_DAYS_PER_SIDE),
  };
}

export function isInDateRail(nbaDate: NbaDate, railCenterDate: NbaDate) {
  const { firstDate, lastDate } = dateRailRange(railCenterDate);
  // NbaDate strings are YYYY-MM-DD, so string order is calendar order.
  return firstDate <= nbaDate && nbaDate <= lastDate;
}

function hrefOf(nbaDate: NbaDate, today: NbaDate) {
  return nbaDate === today ? "/" : `${GAMES_PATH_PREFIX}${nbaDate}`;
}

// The inverse of a rail day's href, so the selection follows the URL, back and forward buttons included.
export function nbaDateOfPath(
  pathname: string,
  today: NbaDate,
): NbaDate | null {
  if (pathname === "/") return today;
  if (!pathname.startsWith(GAMES_PATH_PREFIX)) return null;
  return parseNbaDate(pathname.slice(GAMES_PATH_PREFIX.length));
}

function railDayOf(
  nbaDate: NbaDate,
  selectedDate: NbaDate,
  today: NbaDate,
  gameCounts: GameCounts | null,
): RailDay {
  const gameCount = gameCounts?.[nbaDate] ?? null;
  const countLabel =
    gameCount === null ? null : strings.dateRail.gameCount(gameCount);

  return {
    nbaDate,
    href: hrefOf(nbaDate, today),
    weekday: formatShortNbaWeekday(nbaDate).toUpperCase(),
    dayNumber: formatNbaDayNumber(nbaDate),
    label: strings.dateRail.dayLabel(formatNbaDate(nbaDate), countLabel),
    isSelected: nbaDate === selectedDate,
    gameCount,
    countLabel,
    hasGames: gameCount !== null && gameCount > 0,
  };
}

function dateRailOf(
  railCenterDate: NbaDate,
  selectedDate: NbaDate,
  today: NbaDate,
  gameCounts: GameCounts | null,
): DateRailView {
  const { firstDate } = dateRailRange(railCenterDate);
  const days = Array.from(
    { length: RAIL_DAYS_PER_SIDE * 2 + 1 },
    (_, dayOffset) =>
      railDayOf(
        addDaysToNbaDate(firstDate, dayOffset),
        selectedDate,
        today,
        gameCounts,
      ),
  );

  return { days };
}

export function buildHomeView(input: HomeViewInput): HomeView {
  const { selectedDate, railCenterDate, today, query, filter, gameCounts } =
    input;
  const games =
    query.status === "success" || query.status === "stale"
      ? query.scoreboard.games
      : [];
  const hasGames = games.length > 0;

  return {
    heading: headingOf(selectedDate),
    dateRail: dateRailOf(railCenterDate, selectedDate, today, gameCounts),
    summary: hasGames ? summarize(games) : null,
    filters: hasGames ? filterOptionsOf(filter) : null,
    screen: screenOf(input),
  };
}

export type CalendarDay = {
  nbaDate: NbaDate;
  href: string;
  dayNumber: string;
  // The full date, plus whether it has games, read in place of the day number.
  label: string;
  isSelected: boolean;
  isToday: boolean;
  // False while the season calendar is unknown, so no day reads as a game day by mistake.
  hasGames: boolean;
};

export type CalendarMonthView = {
  title: string;
  previousMonthStart: NbaDate;
  nextMonthStart: NbaDate;
  weekdays: readonly string[];
  // Sunday-first weeks of 7, with null for the days of the months around it.
  weeks: (CalendarDay | null)[][];
};

export type CalendarMonthInput = {
  monthStart: NbaDate;
  selectedDate: NbaDate;
  today: NbaDate;
  seasonCalendar: NbaDate[] | null;
};

const DAYS_PER_WEEK = 7;

export function buildCalendarMonth({
  monthStart,
  selectedDate,
  today,
  seasonCalendar,
}: CalendarMonthInput): CalendarMonthView {
  const gameDates = new Set(seasonCalendar);
  const nextMonthStart = addMonthsToNbaMonth(monthStart, 1);

  const cells: (CalendarDay | null)[] = Array.from(
    { length: nbaDayOfWeek(monthStart) },
    () => null,
  );
  // NbaDate strings are YYYY-MM-DD, so string order is calendar order.
  for (
    let nbaDate = monthStart;
    nbaDate < nextMonthStart;
    nbaDate = addDaysToNbaDate(nbaDate, 1)
  ) {
    const hasGames = gameDates.has(nbaDate);
    cells.push({
      nbaDate,
      href: hrefOf(nbaDate, today),
      dayNumber: formatNbaDayNumber(nbaDate),
      label: strings.calendar.dayLabel(formatNbaDate(nbaDate), hasGames),
      isSelected: nbaDate === selectedDate,
      isToday: nbaDate === today,
      hasGames,
    });
  }
  while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);

  return {
    title: formatNbaMonthYear(monthStart),
    previousMonthStart: addMonthsToNbaMonth(monthStart, -1),
    nextMonthStart,
    weekdays: strings.calendar.weekdays,
    weeks: Array.from(
      { length: cells.length / DAYS_PER_WEEK },
      (_, weekIndex) =>
        cells.slice(weekIndex * DAYS_PER_WEEK, (weekIndex + 1) * DAYS_PER_WEEK),
    ),
  };
}
