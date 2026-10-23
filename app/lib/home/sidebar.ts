import type {
  Leader,
  LeaderCategory,
  LeaderStat,
} from "@/app/lib/domain/leaders";
import type { ConferenceStandings } from "@/app/lib/domain/standings";

const TOP_TEAMS_COUNT = 5;
const RUNNERS_UP_COUNT = 2;
const DEFAULT_CONFERENCE_ABBREVIATION = "West";
const TEAMS_PATH_PREFIX = "/teams/";
// The leader holds rank 1.
const FIRST_RUNNER_UP_RANK = 2;

export type StreakKind = "win" | "loss";

export type SidebarStandingsRow = {
  teamId: string;
  seed: number;
  name: string;
  logoUrl: string | null;
  href: string;
  // Win-loss, e.g. "4-0".
  record: string;
  streak: string | null;
  streakKind: StreakKind | null;
  isFavorite: boolean;
};

export type SidebarStandings = {
  conferenceAbbreviation: string;
  rows: SidebarStandingsRow[];
};

export type SidebarRunnerUp = {
  rank: number;
  shortName: string;
  displayValue: string;
};

export type SidebarLeaderCategory =
  | {
      status: "ready";
      stat: LeaderStat;
      leader: Leader;
      runnersUp: SidebarRunnerUp[];
    }
  | { status: "empty" | "error"; stat: LeaderStat };

function conferenceOfFavorites(
  conferences: ConferenceStandings[],
  favoriteTeamIds: string[],
) {
  for (const teamId of favoriteTeamIds) {
    const conference = conferences.find((candidate) =>
      candidate.rows.some((row) => row.team.id === teamId),
    );
    if (conference) return conference;
  }
  return null;
}

function streakKindOf(streak: string | null): StreakKind | null {
  if (!streak) return null;
  return streak.startsWith("W") ? "win" : "loss";
}

export function buildSidebarStandings(
  conferences: ConferenceStandings[],
  favoriteTeamIds: string[],
): SidebarStandings | null {
  const conference =
    conferenceOfFavorites(conferences, favoriteTeamIds) ??
    conferences.find(
      (candidate) => candidate.abbreviation === DEFAULT_CONFERENCE_ABBREVIATION,
    ) ??
    conferences[0];
  if (!conference) return null;

  return {
    conferenceAbbreviation: conference.abbreviation,
    rows: conference.rows.slice(0, TOP_TEAMS_COUNT).map((row) => ({
      teamId: row.team.id,
      seed: row.seed,
      name: row.team.name,
      logoUrl: row.team.logoUrl,
      href: `${TEAMS_PATH_PREFIX}${row.team.slug}`,
      record: `${row.wins}-${row.losses}`,
      streak: row.streak,
      streakKind: streakKindOf(row.streak),
      isFavorite: favoriteTeamIds.includes(row.team.id),
    })),
  };
}

export function buildSidebarLeaders(
  categories: LeaderCategory[],
): SidebarLeaderCategory[] {
  return categories.map(({ stat, leaders }) => {
    if (leaders === null) return { status: "error", stat };
    const [leader, ...rest] = leaders;
    if (!leader) return { status: "empty", stat };

    return {
      status: "ready",
      stat,
      leader,
      runnersUp: rest
        .slice(0, RUNNERS_UP_COUNT)
        .map(({ athlete, displayValue }, index) => ({
          rank: FIRST_RUNNER_UP_RANK + index,
          shortName: athlete.shortName,
          displayValue,
        })),
    };
  });
}
