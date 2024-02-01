/**
 * Method that returns the winner team
 * @param awayTeam - The team object
 * @param homeTeam - The team object
 * @returns string
 */

import { Team } from "@/app/api/types";
import { AWAY_TEAM, HOME_TEAM } from "@/constants";

export function getWinner(awayTeam: Partial<Team>, homeTeam: Partial<Team>) {
  if (Number(homeTeam.score) === Number(awayTeam.score)) return null;
  return Number(homeTeam.score) > Number(awayTeam.score)
    ? HOME_TEAM
    : AWAY_TEAM;
}
