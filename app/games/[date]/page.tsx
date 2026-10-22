import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

type GamesPageProps = {
  params: Promise<{ date: string }>;
};

export default async function GamesPage({ params }: GamesPageProps) {
  const { date } = await params;

  return (
    <Hydrate>
      <PagePlaceholder title={strings.games.title(date)} />
    </Hydrate>
  );
}
