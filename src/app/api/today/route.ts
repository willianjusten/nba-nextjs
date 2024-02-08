import { API } from "@/constants";
import { parseGames } from "@/helpers/mappers";

export const revalidate = 0;

export async function GET() {
  const res = await fetch(
    `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`
  );

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
