import { API } from "@/constants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `${API.DETAILS_URL}/boxscore/boxscore_${params.id}.json`,
    {
      cache: "no-store",
    }
  );

  if (res.ok) {
    const data = await res.json();
    return Response.json(data);
  }

  return Response.json({
    notStarted: true,
  });
}
