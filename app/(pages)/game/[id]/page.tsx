import SWRProvider from "@/app/components/SWRProvider";
import { GameDetails } from "@/app/components";

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
