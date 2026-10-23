import type { ListedTeam } from "@/app/lib/domain/team";
import { strings } from "@/app/lib/strings";

const TEAMS_PATH_PREFIX = "/teams/";

export type MyTeamLink = {
  teamId: string;
  name: string;
  displayName: string;
  logoUrl: string | null;
  href: string;
};

export type TeamPickerOption = {
  teamId: string;
  displayName: string;
  logoUrl: string | null;
  // Stays the same when followed; the pressed state tells whether it is.
  label: string;
  isFavorite: boolean;
};

// Null while favorites wait on the teams list, so the strip never flashes its empty state.
export function myTeamsOf(
  favoriteTeamIds: string[],
  teams: ListedTeam[] | null,
): MyTeamLink[] | null {
  if (favoriteTeamIds.length === 0) return [];
  if (!teams) return null;

  return favoriteTeamIds.flatMap((teamId) => {
    const team = teams.find((listedTeam) => listedTeam.id === teamId);
    if (!team) return [];
    return {
      teamId,
      name: team.name,
      displayName: team.displayName,
      logoUrl: team.logoUrl,
      href: `${TEAMS_PATH_PREFIX}${team.slug}`,
    };
  });
}

export function buildTeamPicker(
  teams: ListedTeam[],
  favoriteTeamIds: string[],
): TeamPickerOption[] {
  return teams
    .toSorted((first, second) =>
      first.displayName.localeCompare(second.displayName),
    )
    .map((team) => ({
      teamId: team.id,
      displayName: team.displayName,
      logoUrl: team.logoUrl,
      label: strings.myTeams.follow(team.displayName),
      isFavorite: favoriteTeamIds.includes(team.id),
    }));
}
