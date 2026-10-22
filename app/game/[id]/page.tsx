import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

type GamePageProps = {
  params: Promise<{ id: string }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;

  return (
    <Hydrate>
      <PagePlaceholder title={strings.game.title(id)} />
    </Hydrate>
  );
}
