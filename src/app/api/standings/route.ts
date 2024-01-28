import { API } from "@/constants";
import { getLeagueYear } from "@/helpers/date";

export async function GET() {
  const year = getLeagueYear(new Date());
  const nextYear = (year + 1) % 100;
  const season = `${year}-${nextYear}`;

  const res = await fetch(
    `${API.BASE_URL}/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=${season}&SeasonType=Regular%20Season&Section=overall`
  );

  const data = await res.json();

  return Response.json(data);
}
