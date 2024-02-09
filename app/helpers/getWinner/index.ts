import { Team } from "@/app/api/types";
import { AWAY_TEAM, HOME_TEAM } from "@/app/constants";

type getWinnerProps = {
  awayTeam: Pick<Team, "score">;
  homeTeam: Pick<Team, "score">;
};

/**
 * Method that returns the winner team
 * @param awayTeam - The team object
 * @param homeTeam - The team object
 * @returns number
 */
export function getWinner({ awayTeam, homeTeam }: getWinnerProps) {
  if (homeTeam.score === awayTeam.score) return null;
  return homeTeam.score > awayTeam.score ? HOME_TEAM : AWAY_TEAM;
}
