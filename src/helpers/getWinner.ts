/**
 * Method that returns the winner team
 * @param awayTeam - The team object
 * @param homeTeam - The team object
 * @returns string
 */
export function getWinner(awayTeam, homeTeam) {
  if (Number(homeTeam.score) === Number(awayTeam.score)) return null;
  return Number(homeTeam.score) > Number(awayTeam.score)
    ? "homeTeam"
    : "awayTeam";
}
