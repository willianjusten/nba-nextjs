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
  logoUrl: string;
};

export type GameCompetitor = {
  team: Team;
  score: number;
  winner: boolean;
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

export type Game = {
  id: string;
  startTime: string;
  nbaDate: NbaDate;
  seasonYear: number;
  seasonType: SeasonType;
  status: GameStatus;
  home: GameCompetitor;
  away: GameCompetitor;
  // Ordered national first; never empty, since NBA League Pass is the fallback.
  broadcasts: Broadcast[];
  series: PlayoffSeries | null;
};

export type Scoreboard = {
  nbaDate: NbaDate;
  games: Game[];
};
