import { notFound } from "next/navigation";
import DayScoreboard from "@/app/components/DayScoreboard";
import { prefetchDayScoreboard } from "@/app/lib/queries/prefetch-day";
import { Hydrate } from "@/app/lib/query/server";
import { currentNbaDate, parseNbaDate } from "@/app/lib/time/nba-date";

type GamesPageProps = {
  params: Promise<{ date: string }>;
};

export default async function GamesPage({ params }: GamesPageProps) {
  const nbaDate = parseNbaDate((await params).date);
  if (!nbaDate) notFound();

  await prefetchDayScoreboard(nbaDate);

  return (
    <Hydrate>
      <DayScoreboard initialDate={nbaDate} today={currentNbaDate()} />
    </Hydrate>
  );
}
