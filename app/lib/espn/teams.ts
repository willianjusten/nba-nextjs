import type { ListedTeam, TeamDetail, TeamSlug } from "@/app/lib/domain/team";
import { mapListedTeam, mapTeamDetail } from "./mappers";
import type { RawTeamDetailResponse, RawTeamsList } from "./raw-types";
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
  const { team } = await espnGet<RawTeamDetailResponse>("teams", {
    subpath: `/${encodeURIComponent(teamId)}`,
  });

  return mapTeamDetail(team);
}
