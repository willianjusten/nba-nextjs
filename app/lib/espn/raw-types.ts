// Only the fields this app reads from ESPN responses. These types never leave the espn module.

export type RawScoreboard = {
  events?: RawEvent[];
};

export type RawEvent = {
  id: string;
  date: string;
  season: RawSeason;
  status: RawStatus;
  competitions: RawCompetition[];
};

export type RawSeason = {
  year: number;
  type: number;
  slug?: string;
};

export type RawStatus = {
  displayClock: string;
  period: number;
  type: {
    name: string;
    state: string;
  };
};

export type RawCompetition = {
  competitors: RawCompetitor[];
};

export type RawCompetitor = {
  homeAway: "home" | "away";
  score?: string;
  winner?: boolean;
  team: RawTeam;
};

export type RawTeam = {
  id: string;
  abbreviation: string;
  location: string;
  name: string;
  displayName: string;
  color?: string;
  logo: string;
};
