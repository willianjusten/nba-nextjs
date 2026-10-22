import type { Game } from "./game";
import type { Leader, LeaderStat } from "./leaders";

export type BoxScoreAthlete = {
  id: string;
  displayName: string;
  shortName: string;
  jersey: string | null;
  // Position abbreviation, e.g. "G", "F", or "C".
  position: string | null;
  headshotUrl: string | null;
};

// Display values as sent by ESPN, e.g. "9-18" for field goals or "+12" for plus-minus.
export type BoxScoreStats = {
  minutes: string;
  points: string;
  fieldGoals: string;
  threePointers: string;
  freeThrows: string;
  rebounds: string;
  offensiveRebounds: string;
  defensiveRebounds: string;
  assists: string;
  steals: string;
  blocks: string;
  turnovers: string;
  fouls: string;
  plusMinus: string;
};

export type BoxScorePlayer = {
  athlete: BoxScoreAthlete;
  starter: boolean;
  // null for a player who did not play.
  stats: BoxScoreStats | null;
  // Why the player did not play, e.g. "COACH'S DECISION".
  didNotPlayReason: string | null;
};

export type TeamBoxScore = {
  // Starters first, in ESPN's order. Empty before the game starts.
  players: BoxScorePlayer[];
  // null before the game starts. Minutes and plus-minus are empty strings.
  totals: BoxScoreStats | null;
};

export type GameLeader = {
  stat: LeaderStat;
  // Game totals once the game starts; season averages before it.
  leader: Leader;
};

export type CourtCoordinate = {
  x: number;
  y: number;
};

export type Play = {
  id: string;
  period: number;
  clock: string;
  text: string;
  // null for plays without a team, such as the end of a period.
  teamId: string | null;
  homeScore: number;
  awayScore: number;
  scoringPlay: boolean;
  scoreValue: number;
  shootingPlay: boolean;
  // null when ESPN has no valid court location for the play.
  coordinate: CourtCoordinate | null;
};

export type WinProbabilityPoint = {
  playId: string;
  // Between 0 and 1; the away team's chance is the remainder.
  homeWinPercentage: number;
};

export type GameSide<Value> = {
  home: Value;
  away: Value;
};

export type GameSummary = {
  game: Game;
  // Points per period, overtimes included. Empty before the game starts.
  lineScore: GameSide<number[]>;
  boxScore: GameSide<TeamBoxScore>;
  leaders: GameSide<GameLeader[]>;
  // In game order. Empty before the game starts.
  plays: Play[];
  winProbability: WinProbabilityPoint[];
};
