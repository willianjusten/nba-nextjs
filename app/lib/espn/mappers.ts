import type {
  Broadcast,
  BroadcastMarket,
  Game,
  GameCompetitor,
  GameStatus,
  PlayoffSeries,
  SeasonType,
  Team,
} from "@/app/lib/domain/game";
import type {
  ConferenceStandings,
  Season,
  SeasonPhase,
  StandingsRow,
} from "@/app/lib/domain/standings";
import type {
  ListedTeam,
  RosterPlayer,
  TeamDetail,
  TeamSlug,
} from "@/app/lib/domain/team";
import { nbaDateOf } from "@/app/lib/time/nba-date";
import type {
  RawBroadcast,
  RawCompetitor,
  RawConferenceStandings,
  RawEvent,
  RawGeoBroadcast,
  RawListedTeam,
  RawRosterAthlete,
  RawScheduleCompetitor,
  RawScheduleEvent,
  RawScheduleTeam,
  RawTeamDetailResponse,
  RawSeason,
  RawSeries,
  RawStandingsEntry,
  RawStandingsResponse,
  RawStandingsStat,
  RawStatus,
  RawTeam,
} from "./raw-types";

const SEASON_TYPE_BY_ID: Record<number, SeasonType> = {
  1: "preseason",
  2: "regular",
  3: "postseason",
  5: "play-in",
};

const SEASON_TYPE_BY_SLUG: Record<string, SeasonType> = {
  preseason: "preseason",
  "regular-season": "regular",
  "post-season": "postseason",
  "play-in-season": "play-in",
};

function mapSeasonType(season: Pick<RawSeason, "type" | "slug">): SeasonType {
  return (
    SEASON_TYPE_BY_ID[season.type] ??
    (season.slug ? SEASON_TYPE_BY_SLUG[season.slug] : undefined) ??
    "regular"
  );
}

function mapStatus(status: RawStatus): GameStatus {
  switch (status.type.name) {
    case "STATUS_POSTPONED":
      return { kind: "postponed" };
    case "STATUS_CANCELED":
      return { kind: "canceled" };
    case "STATUS_HALFTIME":
      return { kind: "halftime", period: status.period };
  }

  switch (status.type.state) {
    case "in":
      return {
        kind: "live",
        period: status.period,
        clock: status.displayClock,
      };
    case "post":
      return { kind: "final", period: status.period };
    case "pre":
      return { kind: "scheduled" };
    default:
      // Guessing "scheduled" here would show a game as not started when ESPN sent something unexpected.
      throw new Error(`Unknown ESPN game state: ${status.type.state}`);
  }
}

function mapTeam(team: RawTeam): Team {
  return {
    id: team.id,
    abbreviation: team.abbreviation,
    name: team.name,
    displayName: team.displayName,
    location: team.location,
    color: team.color ?? null,
    logoUrl: team.logo,
  };
}

function teamSlugOf(teamName: string): TeamSlug {
  return teamName.toLowerCase().trim().replaceAll(/\s+/g, "-");
}

// The scoreboard variant matches the logo the games list already uses.
function pickScoreboardLogo(logos: RawListedTeam["logos"]) {
  const scoreboardLogo = logos.find(
    (logo) => logo.rel.includes("scoreboard") && !logo.rel.includes("dark"),
  );
  return (scoreboardLogo ?? logos[0])?.href ?? "";
}

export function mapListedTeam(team: RawListedTeam): ListedTeam {
  return {
    ...mapTeam({ ...team, logo: pickScoreboardLogo(team.logos) }),
    slug: teamSlugOf(team.name),
  };
}

export function mapTeamDetail(team: RawTeamDetailResponse["team"]): TeamDetail {
  const overallRecord = team.record?.items?.find(
    (recordItem) => recordItem.type === "total",
  );

  return {
    ...mapListedTeam(team),
    record: overallRecord?.summary ?? null,
    standingSummary: team.standingSummary ?? null,
  };
}

// The scoreboard sends scores as strings and the team schedule as { value, displayValue } objects.
function normalizeScore(
  rawScore: RawCompetitor["score"] | RawScheduleCompetitor["score"],
) {
  const score =
    typeof rawScore === "object" && rawScore !== null
      ? rawScore.value
      : Number(rawScore);
  return Number.isFinite(score) ? score : 0;
}

function mapCompetitor(competitor: RawCompetitor): GameCompetitor {
  return {
    team: mapTeam(competitor.team),
    score: normalizeScore(competitor.score),
    winner: competitor.winner ?? false,
  };
}

function mapScheduleTeam(team: RawScheduleTeam): Team {
  return mapTeam({
    ...team,
    name: team.shortDisplayName,
    logo: pickScoreboardLogo(team.logos),
  });
}

function mapScheduleCompetitor(
  competitor: RawScheduleCompetitor,
): GameCompetitor {
  return {
    team: mapScheduleTeam(competitor.team),
    score: normalizeScore(competitor.score),
    winner: competitor.winner ?? false,
  };
}

function findCompetitor<Competitor extends { homeAway: "home" | "away" }>(
  eventId: string,
  competitors: Competitor[] | undefined,
  side: Competitor["homeAway"],
) {
  const competitor = competitors?.find(
    (candidate) => candidate.homeAway === side,
  );
  if (!competitor) {
    throw new Error(`ESPN event ${eventId} has no ${side} competitor`);
  }
  return competitor;
}

const MARKET_PRIORITY: BroadcastMarket[] = ["national", "home", "away"];
// Product decision: only these channels are shown, local networks and team apps are left out.
const SUPPORTED_BROADCAST_NAMES = new Set([
  "espn",
  "prime video",
  "nba league pass",
]);
// League Pass carries every game, so a game without a supported channel is still watchable there.
const FALLBACK_BROADCAST: Broadcast = {
  name: "NBA League Pass",
  market: "national",
};

function toMarket(rawMarket: string): BroadcastMarket | undefined {
  const market = rawMarket.toLowerCase();
  return MARKET_PRIORITY.find((candidate) => candidate === market);
}

function mapBroadcasts(
  rawBroadcasts: RawBroadcast[] = [],
  rawGeoBroadcasts: RawGeoBroadcast[] = [],
): Broadcast[] {
  const listedBroadcasts = rawBroadcasts.flatMap((broadcast) => {
    const market = toMarket(broadcast.market);
    return market ? broadcast.names.map((name) => ({ name, market })) : [];
  });
  const usGeoBroadcasts = rawGeoBroadcasts.flatMap((broadcast) => {
    const market = toMarket(broadcast.market.type);
    const isUs = (broadcast.region ?? "us") === "us";
    return market && isUs ? [{ name: broadcast.media.shortName, market }] : [];
  });

  const broadcastByNormalizedName = new Map<string, Broadcast>();
  for (const market of MARKET_PRIORITY) {
    for (const broadcast of [...listedBroadcasts, ...usGeoBroadcasts]) {
      const key = broadcast.name.toLowerCase();
      if (
        broadcast.market === market &&
        SUPPORTED_BROADCAST_NAMES.has(key) &&
        !broadcastByNormalizedName.has(key)
      ) {
        broadcastByNormalizedName.set(key, broadcast);
      }
    }
  }
  return broadcastByNormalizedName.size > 0
    ? [...broadcastByNormalizedName.values()]
    : [FALLBACK_BROADCAST];
}

function mapSeries(
  series: RawSeries | undefined,
  homeTeamId: string,
  awayTeamId: string,
): PlayoffSeries | null {
  if (series?.type !== "playoff") {
    return null;
  }
  const winsOf = (teamId: string) =>
    series.competitors.find((competitor) => competitor.id === teamId)?.wins ??
    0;

  return {
    summary: series.summary,
    completed: series.completed,
    totalGames: series.totalCompetitions,
    homeWins: winsOf(homeTeamId),
    awayWins: winsOf(awayTeamId),
  };
}

export function mapGame(event: RawEvent): Game {
  const competition = event.competitions[0];
  const home = findCompetitor(event.id, competition?.competitors, "home");
  const away = findCompetitor(event.id, competition?.competitors, "away");

  return {
    id: event.id,
    startTime: event.date,
    nbaDate: nbaDateOf(event.date),
    seasonYear: event.season.year,
    seasonType: mapSeasonType(event.season),
    status: mapStatus(event.status),
    home: mapCompetitor(home),
    away: mapCompetitor(away),
    broadcasts: mapBroadcasts(
      competition?.broadcasts,
      competition?.geoBroadcasts,
    ),
    series: mapSeries(competition?.series, home.team.id, away.team.id),
  };
}

export function mapScheduleGame(event: RawScheduleEvent): Game {
  const competition = event.competitions[0];
  if (!competition) {
    throw new Error(`ESPN schedule event ${event.id} has no competition`);
  }
  const home = findCompetitor(event.id, competition.competitors, "home");
  const away = findCompetitor(event.id, competition.competitors, "away");

  return {
    id: event.id,
    startTime: event.date,
    nbaDate: nbaDateOf(event.date),
    seasonYear: event.season.year,
    seasonType: mapSeasonType(event.seasonType),
    status: mapStatus(competition.status),
    home: mapScheduleCompetitor(home),
    away: mapScheduleCompetitor(away),
    // The schedule sends its broadcasts in the geoBroadcast shape.
    broadcasts: mapBroadcasts([], competition.broadcasts),
    series: mapSeries(competition.series, home.team.id, away.team.id),
  };
}

export function mapRosterPlayer(athlete: RawRosterAthlete): RosterPlayer {
  return {
    id: athlete.id,
    displayName: athlete.displayName,
    jersey: athlete.jersey ?? null,
    position: athlete.position?.abbreviation ?? null,
    height: athlete.displayHeight ?? null,
    weight: athlete.displayWeight ?? null,
    age: athlete.age ?? null,
    headshotUrl: athlete.headshot?.href ?? null,
  };
}

const OFFSEASON_TYPE_ID = 4;

function seasonPhaseOf(seasonTypeId: number): SeasonPhase | undefined {
  return seasonTypeId === OFFSEASON_TYPE_ID
    ? "offseason"
    : SEASON_TYPE_BY_ID[seasonTypeId];
}

// The season calendar lists each season type with its date range, so the current phase follows from the time alone.
export function mapSeason(
  { season, seasons }: RawStandingsResponse,
  now: Date,
): Season {
  const calendar = seasons?.find(
    (candidate) => candidate.year === season.year,
  )?.types;
  // Without the calendar the phase would silently read as offseason.
  if (!calendar) {
    throw new Error(
      `ESPN standings have no calendar for season ${season.year}`,
    );
  }
  const currentCalendarEntry = calendar.find(
    (entry) =>
      new Date(entry.startDate) <= now && now <= new Date(entry.endDate),
  );

  return {
    year: season.year,
    displayName: season.displayName,
    // Outside every listed range the league is between seasons.
    currentPhase:
      (currentCalendarEntry &&
        seasonPhaseOf(Number(currentCalendarEntry.id))) ??
      "offseason",
  };
}

// A missing stat means ESPN changed the format; a default of 0 would show a plausible but wrong table.
function requiredStat(
  stat: RawStandingsStat | undefined,
  key: string,
  teamId: string,
) {
  if (!stat) {
    throw new Error(`ESPN standings for team ${teamId} have no ${key} stat`);
  }
  return stat;
}

function mapStandingsRow({ team, stats }: RawStandingsEntry): StandingsRow {
  const numericStat = (name: string) => {
    const { value } = requiredStat(
      stats.find((stat) => stat.name === name),
      name,
      team.id,
    );
    if (value === undefined) {
      throw new Error(`ESPN standings ${name} stat has no value`);
    }
    return value;
  };
  // Record stats such as "Home" are named for display, so they are found by type.
  const recordStat = (type: string) => {
    const { summary } = requiredStat(
      stats.find((stat) => stat.type === type),
      type,
      team.id,
    );
    if (summary === undefined) {
      throw new Error(`ESPN standings ${type} record has no summary`);
    }
    return summary;
  };
  // ESPN sends "-" as the streak of a team that has not played yet.
  const streak = stats.find((stat) => stat.name === "streak")?.displayValue;

  return {
    team: mapListedTeam(team),
    seed: numericStat("playoffSeed"),
    wins: numericStat("wins"),
    losses: numericStat("losses"),
    winPercent: numericStat("winPercent"),
    gamesBehind: numericStat("gamesBehind"),
    homeRecord: recordStat("home"),
    roadRecord: recordStat("road"),
    // ESPN leaves the last ten games out until a team has played.
    lastTenRecord:
      stats.find((stat) => stat.type === "lasttengames")?.summary ?? "0-0",
    streak: streak && streak !== "-" ? streak : null,
  };
}

// ESPN does not send the entries in standings order, and early in the season several teams can share a seed.
function compareStandingsRows(first: StandingsRow, second: StandingsRow) {
  return (
    first.seed - second.seed ||
    second.winPercent - first.winPercent ||
    first.team.displayName.localeCompare(second.team.displayName)
  );
}

export function mapConferenceStandings(
  conference: RawConferenceStandings,
): ConferenceStandings {
  return {
    id: conference.id,
    name: conference.name,
    abbreviation: conference.abbreviation,
    rows: conference.standings.entries
      .map(mapStandingsRow)
      .sort(compareStandingsRows),
  };
}
