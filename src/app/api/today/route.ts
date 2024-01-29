import { parseGames } from "@/helpers/mappers";

export async function GET() {
  const res = await fetch(
    `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`,
    { next: { revalidate: 0 } }
  );

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
