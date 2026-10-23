"use client";

import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  buildHomeView,
  type ScoreboardQueryState,
} from "@/app/lib/home/home-view";
import { useScoreboard } from "@/app/lib/queries/use-scoreboard";
import { useBrowserTimeZone } from "@/app/lib/time/use-browser-time-zone";
import GamesList from "@/app/components/GamesList";
import DateHeading from "./DateHeading";

export default function DayScoreboard({ nbaDate }: { nbaDate: NbaDate }) {
  const {
    data: scoreboard,
    dataUpdatedAt,
    error,
    isFetching,
    isRefetchError,
    refetch,
  } = useScoreboard(nbaDate);
  const timeZone = useBrowserTimeZone();

  // Data is checked before the error: a failed refetch keeps the last valid scoreboard instead of hiding it.
  const query: ScoreboardQueryState = scoreboard
    ? isRefetchError
      ? { status: "stale", scoreboard, updatedAt: dataUpdatedAt }
      : { status: "success", scoreboard }
    : error
      ? { status: "error" }
      : { status: "loading" };

  const homeView = buildHomeView({
    nbaDate,
    query,
    now: new Date(),
    timeZone,
  });

  return (
    <section className="flex flex-col gap-6 py-6 md:py-8">
      <DateHeading heading={homeView.heading} summary={homeView.summary} />
      <GamesList
        nbaDate={nbaDate}
        screen={homeView.screen}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    </section>
  );
}
