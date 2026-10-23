"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FOCUS_RING_CLASS_NAME } from "@/app/components/DatePicker/DatePickerTrigger";
import TeamLogo from "@/app/components/TeamLogo";
import TeamPicker from "@/app/components/TeamPicker";
import { myTeamsOf, type MyTeamLink } from "@/app/lib/favorites/my-teams";
import { useFavoriteTeamIds } from "@/app/lib/favorites/use-favorite-team-ids";
import { teamsQueryOptions } from "@/app/lib/queries/teams";
import { strings } from "@/app/lib/strings";

// The site header on desktop, below the date heading on the mobile home page, as the two artboards draw it.
export type MyTeamsPlacement = "header" | "home";

const PILL_CLASS_NAMES: Record<MyTeamsPlacement, string> = {
  header: "size-11 justify-center",
  home: "min-h-11 gap-1.5 py-1 pr-3 pl-1.5 text-xs font-bold",
};
const LOGO_SIZES: Record<MyTeamsPlacement, number> = {
  header: 28,
  home: 24,
};

function MyTeamPill({
  team,
  placement,
}: {
  team: MyTeamLink;
  placement: MyTeamsPlacement;
}) {
  return (
    <Link
      href={team.href}
      aria-label={team.displayName}
      className={`flex shrink-0 items-center rounded-full border border-favorite/40 bg-favorite/10 transition-colors hover:bg-favorite/18 ${PILL_CLASS_NAMES[placement]} ${FOCUS_RING_CLASS_NAME}`}
    >
      <TeamLogo logoUrl={team.logoUrl} size={LOGO_SIZES[placement]} />
      {placement === "home" && <span aria-hidden="true">{team.name}</span>}
    </Link>
  );
}

export default function MyTeamsStrip({
  placement,
}: {
  placement: MyTeamsPlacement;
}) {
  const favoriteTeamIds = useFavoriteTeamIds();
  // Only favorites need the teams list here, to resolve their names and logos.
  const { data: teams, isError } = useQuery({
    ...teamsQueryOptions(),
    enabled: favoriteTeamIds.length > 0,
  });
  // A failed teams list leaves just the picker instead of an empty strip.
  const myTeams = myTeamsOf(favoriteTeamIds, teams ?? (isError ? [] : null));

  return (
    <nav
      aria-label={strings.myTeams.label}
      className={`min-h-11 items-center gap-2 ${placement === "header" ? "hidden md:flex" : "flex overflow-x-auto md:hidden"}`}
    >
      <TeamPicker />
      {myTeams?.map((team) => (
        <MyTeamPill key={team.teamId} team={team} placement={placement} />
      ))}
    </nav>
  );
}
