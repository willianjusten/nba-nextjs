export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${params.id}.json`,
    { next: { revalidate: 20 } }
  );

  const data = await res.json();

  return Response.json(data);
}
