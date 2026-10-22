import { notFound } from "next/navigation";
import DayScoreboard from "@/app/components/DayScoreboard";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { getServerQueryClient, Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";
import { formatNbaDate, parseNbaDate } from "@/app/lib/time/nba-date";

type GamesPageProps = {
  params: Promise<{ date: string }>;
};

export default async function GamesPage({ params }: GamesPageProps) {
  const nbaDate = parseNbaDate((await params).date);
  if (!nbaDate) notFound();

  await getServerQueryClient().prefetchQuery(scoreboardQueryOptions(nbaDate));

  return (
    <Hydrate>
      <DayScoreboard
        title={strings.games.title(formatNbaDate(nbaDate))}
        nbaDate={nbaDate}
      />
    </Hydrate>
  );
}
