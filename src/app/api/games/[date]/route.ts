import { parseGames } from "@/helpers/mappers";

type Params = {
  params: {
    date: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const res = await fetch(
    `https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats/scoreboardv3&GameDate=${params.date}&LeagueID=00`,
    { next: { revalidate: 20 } }
  );

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
