import { API } from "@/app/constants";
import { parseGames } from "@/app/helpers";

export const revalidate = 0;

export async function GET() {
  const res = await fetch(API.TODAY_URL_PROXY, {
    cache: "no-store",
  });

  const data = await res.json();
  const parsedGames = parseGames(data);

  return Response.json(parsedGames);
}
