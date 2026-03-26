import { format } from "date-fns/format";
import { dehydrate, QueryClient } from "@tanstack/react-query";

import QueryClientProvider from "@/app/components/QueryClientProvider";
import { GameDetails } from "@/app/components";
import { DATE_TITLE_FORMAT } from "@/app/constants";

async function getData(id: string) {
  const res = await fetch(`${process.env.API_DOMAIN}/api/game/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
}

type GameDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: GameDetailsProps) {
  const params = await props.params;
  const data = await getData(params.id);
  const homeTeam = data.game?.homeTeam.teamName;
  const awayTeam = data.game?.awayTeam.teamName;
  const date = new Date(data.game?.gameTimeUTC);

  if (data.game) {
    return {
      title: `${awayTeam} x ${homeTeam} | NBA Next.JS`,
      description: `See ${awayTeam} x ${homeTeam} results for the game on ${format(
        date,
        DATE_TITLE_FORMAT,
      )}`,
    };
  }
}

export default async function Page(props: GameDetailsProps) {
  const params = await props.params;
  const { id } = params;

  const data = await getData(id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["game", id],
    queryFn: () => getData(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider dehydratedState={dehydratedState}>
      <GameDetails id={id} />
    </QueryClientProvider>
  );
}
