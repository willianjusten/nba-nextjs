import { API } from "@/constants";
import { parseGames } from "@/helpers/mappers";

type Params = {
  params: {
    date: string;
  };
};

export const revalidate = 0;

export async function GET(request: Request, { params }: Params) {
  const res = await fetch(
    `${API.BASE_URL}/scoreboardv3&GameDate=${params.date}&LeagueID=00`
  );

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
