import { format } from "date-fns/format";

import SWRProvider from "@/app/components/SWRProvider";
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
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: GameDetailsProps) {
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

export default async function Page({ params: { id } }: GameDetailsProps) {
  const data = await getData(id);

  const fallback = {
    [`/api/game/${id}`]: data,
  };

  return (
    <SWRProvider fallback={fallback}>
      <GameDetails id={id} />
    </SWRProvider>
  );
}
