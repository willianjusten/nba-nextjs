export async function GET() {
  const res = await fetch(
    `https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=2023-24&SeasonType=Regular%20Season&Section=overall
    `
  );

  const data = await res.json();

  return Response.json(data);
}
