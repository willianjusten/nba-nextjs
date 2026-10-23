import type { Game } from "@/app/lib/domain/game";
import type {
  ListedTeam,
  RosterPlayer,
  TeamDetail,
  TeamSlug,
} from "@/app/lib/domain/team";
import {
  mapListedTeam,
  mapRosterPlayer,
  mapScheduleGame,
  mapTeamDetail,
} from "./mappers";
import type {
  RawRosterResponse,
  RawTeamDetailResponse,
  RawTeamScheduleResponse,
  RawTeamsList,
} from "./raw-types";
import { espnGet } from "./transport";

export async function fetchTeams(): Promise<ListedTeam[]> {
  const rawTeamsList = await espnGet<RawTeamsList>("teams");
  const rawTeams = rawTeamsList.sports?.[0]?.leagues?.[0]?.teams;

  // An unexpected shape must surface as an error, not as every team page being not found.
  if (!Array.isArray(rawTeams)) {
    throw new Error("ESPN teams response has no teams list");
  }

  return rawTeams.map(({ team }) => mapListedTeam(team));
}

export async function fetchTeamIdBySlug(
  slug: TeamSlug,
): Promise<string | null> {
  const teams = await fetchTeams();
  return teams.find((team) => team.slug === slug)?.id ?? null;
}

export async function fetchTeamDetail(teamId: string): Promise<TeamDetail> {
  const { team } = await espnGet<RawTeamDetailResponse>("team", {
    pathParams: { teamId },
  });

  return mapTeamDetail(team);
}

// Past and upcoming games of the current season type, in date order.
export async function fetchTeamSchedule(teamId: string): Promise<Game[]> {
  const rawSchedule = await espnGet<RawTeamScheduleResponse>("teamSchedule", {
    pathParams: { teamId },
  });

  // A missing events list means ESPN sent something unexpected, which must not read as a team without games.
  if (!Array.isArray(rawSchedule.events)) {
    throw new Error(`ESPN schedule for team ${teamId} has no events list`);
  }

  return rawSchedule.events.map(mapScheduleGame);
}

export async function fetchTeamRoster(teamId: string): Promise<RosterPlayer[]> {
  const rawRoster = await espnGet<RawRosterResponse>("teamRoster", {
    pathParams: { teamId },
  });

  if (!Array.isArray(rawRoster.athletes)) {
    throw new Error(`ESPN roster for team ${teamId} has no athletes list`);
  }

  return rawRoster.athletes.map(mapRosterPlayer);
}
