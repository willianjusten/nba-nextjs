import DayScoreboard from "@/app/components/DayScoreboard";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { getServerQueryClient, Hydrate } from "@/app/lib/query/server";
import { currentNbaDate } from "@/app/lib/time/nba-date";

// The current NBA date depends on request time, so the page cannot be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const nbaDate = currentNbaDate();
  await getServerQueryClient().prefetchQuery(scoreboardQueryOptions(nbaDate));

  return (
    <Hydrate>
      <DayScoreboard nbaDate={nbaDate} />
    </Hydrate>
  );
}
