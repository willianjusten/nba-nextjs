import type { NbaDate } from "./nba-date";

export type SeasonType = "preseason" | "regular" | "play-in" | "postseason";

export type GameStatus =
  | { kind: "scheduled" }
  | { kind: "live"; period: number; clock: string }
  | { kind: "halftime"; period: number }
  | { kind: "final"; period: number }
  | { kind: "postponed" }
  | { kind: "canceled" };

export type Team = {
  id: string;
  abbreviation: string;
  name: string;
  displayName: string;
  location: string;
  color: string | null;
  alternateColor: string | null;
  // Null when ESPN has no logo for the team.
  logoUrl: string | null;
};

export type GameCompetitor = {
  team: Team;
  score: number;
  winner: boolean;
  // Overall win-loss record such as "3-1"; null when ESPN leaves it out, e.g. for exhibition opponents.
  record: string | null;
};

export type BroadcastMarket = "national" | "home" | "away";

export type Broadcast = {
  name: string;
  market: BroadcastMarket;
};

export type PlayoffSeries = {
  summary: string;
  completed: boolean;
  totalGames: number;
  homeWins: number;
  awayWins: number;
};

export type TopScorer = {
  shortName: string;
  points: number;
  // ESPN's line of the athlete's notable stats, e.g. "28 PTS, 7 REB"; null when ESPN rates another player higher.
  statLine: string | null;
};

export type Game = {
  id: string;
  startTime: string;
  nbaDate: NbaDate;
  seasonYear: number;
  seasonType: SeasonType;
  status: GameStatus;
  venue: string | null;
  home: GameCompetitor;
  away: GameCompetitor;
  // Ordered national first; never empty, since NBA League Pass is the fallback.
  broadcasts: Broadcast[];
  series: PlayoffSeries | null;
  // From 0 to 1, as of the last play; null when ESPN sends none, as outside live games.
  homeWinProbability: number | null;
  // Null before tip-off, when ESPN lists season averages instead of game stats.
  topScorer: TopScorer | null;
};

export type Scoreboard = {
  nbaDate: NbaDate;
  games: Game[];
};

// Games per NBA date; every day of the requested range has an entry, zero when it has no games.
export type GameCounts = Partial<Record<NbaDate, number>>;
