import GameDetail from "@/app/components/GameDetail";
import { gameSummaryQueryOptions } from "@/app/lib/queries/game-summary";
import { getServerQueryClient, Hydrate } from "@/app/lib/query/server";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  await getServerQueryClient().prefetchQuery(gameSummaryQueryOptions(id));

  return (
    <Hydrate>
      <section className="py-8">
        <GameDetail gameId={id} />
      </section>
    </Hydrate>
  );
}
