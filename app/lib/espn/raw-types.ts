// Only the fields this app reads from ESPN responses. These types never leave the espn module.

export type RawScoreboard = {
  events?: RawEvent[];
  // Each entry is a day with games, as an instant at the start of that Eastern day.
  leagues?: { calendar?: string[] }[];
};

export type RawScoreboardHeader = {
  sports?: {
    // ESPN leaves events out when the range has no games.
    leagues?: { events?: { date: string }[] }[];
  }[];
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
  venue?: RawVenue;
  // Only while the game is live.
  situation?: {
    lastPlay?: { probability?: { homeWinPercentage: number } };
  };
};

export type RawRecord = {
  type: string;
  summary: string;
};

export type RawVenue = {
  fullName: string;
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
  records?: RawRecord[];
  leaders?: RawCompetitorLeaderCategory[];
};

// Game stats once the game starts ("points", "rating"); season averages before it ("pointsPerGame").
export type RawCompetitorLeaderCategory = {
  name: string;
  leaders: {
    value: number;
    displayValue: string;
    athlete: { id: string; shortName: string };
  }[];
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
  venue?: RawVenue;
};

export type RawScheduleCompetitor = {
  homeAway: "home" | "away";
  // null before the game starts.
  score?: { value: number; displayValue: string } | null;
  winner?: boolean | null;
  team: RawScheduleTeam;
  record?: { type: string; displayValue: string }[];
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
  alternateColor?: string;
  // Missing for non-NBA opponents such as international exhibition teams.
  logo?: string;
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

export type RawSummary = {
  header: RawSummaryHeader;
  boxscore?: { players?: RawBoxScoreTeam[] };
  leaders?: RawSummaryTeamLeaders[];
  // Missing before the game starts.
  plays?: RawPlay[];
  winprobability?: RawWinProbabilityPoint[];
  gameInfo?: { venue?: RawVenue };
};

// The summary header carries the event's season, while its competition mirrors a scoreboard competition.
export type RawSummaryHeader = {
  id: string;
  season: RawSeason;
  competitions: RawSummaryCompetition[];
};

export type RawSummaryCompetition = {
  date: string;
  // Unlike the scoreboard, the summary can leave the period and clock out of the status.
  status: Omit<RawStatus, "period" | "displayClock"> &
    Partial<Pick<RawStatus, "period" | "displayClock">>;
  competitors: RawSummaryCompetitor[];
  broadcasts?: RawGeoBroadcast[];
  series?: RawSeries[];
};

export type RawSummaryCompetitor = {
  homeAway: "home" | "away";
  // Missing before the game starts.
  score?: string;
  winner?: boolean;
  team: RawListedTeam;
  linescores?: { displayValue: string }[];
  record?: RawRecord[];
};

export type RawBoxScoreTeam = {
  team: { id: string };
  statistics: RawBoxScoreStatistics[];
};

export type RawBoxScoreStatistics = {
  // Names each position of the athletes' stats and of the totals, e.g. "fieldGoalsMade-fieldGoalsAttempted".
  keys: string[];
  athletes: RawBoxScoreAthlete[];
  totals: string[];
};

export type RawBoxScoreAthlete = {
  starter: boolean;
  didNotPlay?: boolean;
  reason?: string;
  // Empty for a player who did not play.
  stats: string[];
  athlete: {
    id: string;
    displayName: string;
    shortName: string;
    jersey?: string;
    position?: { abbreviation: string };
    headshot?: { href: string };
  };
};

export type RawSummaryTeamLeaders = {
  team: { id: string };
  leaders?: RawSummaryLeaderCategory[];
};

export type RawSummaryLeaderCategory = {
  // "points" once the game starts, "pointsPerGame" before it.
  name: string;
  leaders: (Omit<RawLeader, "athlete"> & { athlete: RawLeaderAthlete })[];
};

export type RawPlay = {
  id: string;
  text: string;
  period: { number: number };
  clock: { displayValue: string };
  team?: { id: string };
  homeScore: number;
  awayScore: number;
  scoringPlay: boolean;
  scoreValue: number;
  shootingPlay: boolean;
  coordinate?: { x: number; y: number };
};

export type RawWinProbabilityPoint = {
  playId: string;
  homeWinPercentage: number;
};
