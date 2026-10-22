import type { SeasonType } from "./game";
import type { ListedTeam } from "./team";

export type SeasonPhase = SeasonType | "offseason";

export type Season = {
  // ESPN names a season by the year it ends in, e.g. 2027 for 2026-27.
  year: number;
  displayName: string;
  currentPhase: SeasonPhase;
};

export type StandingsRow = {
  team: ListedTeam;
  seed: number;
  wins: number;
  losses: number;
  // Fraction between 0 and 1.
  winPercent: number;
  // 0 for the conference leader.
  gamesBehind: number;
  // Win-loss strings, e.g. "3-1".
  homeRecord: string;
  roadRecord: string;
  lastTenRecord: string;
  // e.g. "W3" or "L1"; null before the team has played.
  streak: string | null;
};

export type ConferenceStandings = {
  id: string;
  name: string;
  abbreviation: string;
  // Ordered by playoff seed.
  rows: StandingsRow[];
};

export type Standings = {
  season: Season;
  conferences: ConferenceStandings[];
};
