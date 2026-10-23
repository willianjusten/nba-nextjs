import DayScoreboard from "@/app/components/DayScoreboard";
import { prefetchDayScoreboard } from "@/app/lib/queries/prefetch-day";
import { Hydrate } from "@/app/lib/query/server";
import { currentNbaDate } from "@/app/lib/time/nba-date";

// The current NBA date depends on request time, so the page cannot be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const nbaDate = currentNbaDate();
  await prefetchDayScoreboard(nbaDate);

  return (
    <Hydrate>
      <DayScoreboard initialDate={nbaDate} today={nbaDate} />
    </Hydrate>
  );
}
