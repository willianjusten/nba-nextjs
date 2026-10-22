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

export type RawTeamScheduleResponse = {
  events?: RawScheduleEvent[];
};

// Team schedule events differ from scoreboard events: status lives on the competition, season type in
// its own field, scores are { value, displayValue } objects, and broadcasts use the geoBroadcast shape.
export type RawScheduleEvent = {
  id: string;
  date: string;
  season: { year: number };
  seasonType: { type: number };
  competitions: RawScheduleCompetition[];
};

export type RawScheduleCompetition = {
  status: RawStatus;
  competitors: RawScheduleCompetitor[];
  broadcasts?: RawGeoBroadcast[];
  series?: RawSeries;
};

export type RawScheduleCompetitor = {
  homeAway: "home" | "away";
  // null before the game starts.
  score?: { value: number; displayValue: string } | null;
  winner?: boolean | null;
  team: RawScheduleTeam;
};

export type RawScheduleTeam = {
  id: string;
  abbreviation: string;
  location: string;
  displayName: string;
  shortDisplayName: string;
  logos: RawListedTeam["logos"];
};

export type RawRosterResponse = {
  athletes?: RawRosterAthlete[];
};

export type RawRosterAthlete = {
  id: string;
  displayName: string;
  jersey?: string;
  position?: { abbreviation: string };
  displayHeight?: string;
  displayWeight?: string;
  age?: number;
  headshot?: { href: string };
};

export type RawTeamsList = {
  sports: { leagues: { teams: { team: RawListedTeam }[] }[] }[];
};

export type RawTeamDetailResponse = {
  team: RawListedTeam & {
    record?: { items?: { type: string; summary: string }[] };
    standingSummary?: string;
  };
};

// Team as listed by the teams endpoints, which send a logo list instead of a single logo.
export type RawListedTeam = Omit<RawTeam, "logo"> & {
  logos: { href: string; rel: string[] }[];
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

export type RawStandingsResponse = {
  season: RawStandingsSeason;
  seasons?: RawStandingsSeason[];
  children?: RawConferenceStandings[];
};

export type RawStandingsSeason = {
  year: number;
  displayName: string;
  types?: RawSeasonCalendarEntry[];
};

export type RawSeasonCalendarEntry = {
  id: string;
  startDate: string;
  endDate: string;
};

export type RawConferenceStandings = {
  id: string;
  name: string;
  abbreviation: string;
  standings: { entries: RawStandingsEntry[] };
};

export type RawStandingsEntry = {
  team: RawListedTeam;
  stats: RawStandingsStat[];
};

// Numeric stats carry value and displayValue; record stats such as "home" carry a summary instead.
export type RawStandingsStat = {
  name: string;
  type: string;
  value?: number;
  displayValue?: string;
  summary?: string;
};

export type RawCurrentSeason = {
  year: number;
};

export type RawRef = {
  $ref: string;
};

export type RawLeadersResponse = {
  categories?: RawLeaderCategory[];
};

export type RawLeaderCategory = {
  name: string;
  leaders: RawLeader[];
};

export type RawLeader = {
  value: number;
  displayValue: string;
  athlete: RawRef;
};

export type RawLeaderAthlete = {
  id: string;
  displayName: string;
  headshot?: { href: string };
};
