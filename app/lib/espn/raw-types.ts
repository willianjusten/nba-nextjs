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
  broadcasts?: RawBroadcast[];
  geoBroadcasts?: RawGeoBroadcast[];
  series?: RawSeries;
};

export type RawBroadcast = {
  market: string;
  names: string[];
};

export type RawGeoBroadcast = {
  market: { type: string };
  media: { shortName: string };
  region?: string;
};

export type RawSeries = {
  type: string;
  summary: string;
  completed: boolean;
  totalCompetitions: number;
  competitors: { id: string; wins: number }[];
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
