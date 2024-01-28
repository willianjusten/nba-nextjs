export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const res = await fetch(
    `https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats/scoreboardv3&GameDate=${params.date}&LeagueID=00`,
    { next: { revalidate: 20 } }
  );

  const data = await res.json();

  return Response.json(data);
}
