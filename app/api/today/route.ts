import { API } from "@/app/constants";
import { parseGames } from "@/app/helpers";

export const revalidate = 0;

export async function GET() {
  const res = await fetch(
    `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
