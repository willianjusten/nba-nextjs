import { queryOptions } from "@tanstack/react-query";
import { fetchTeams } from "@/app/lib/espn";

// The teams list changes at most between seasons, so it is cached for a day and never polled.
const TEAMS_STALE_MILLISECONDS = 24 * 60 * 60 * 1000;

export function teamsQueryOptions() {
  return queryOptions({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: TEAMS_STALE_MILLISECONDS,
  });
}
