import { API } from "@/constants";

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API.DETAILS_URL}/boxscore_${params.id}.json`);

  const data = await res.json();

  return Response.json(data);
}
