"use client";

import { useQuery } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  buildHomeView,
  dateRailRange,
  type ScoreboardQueryState,
} from "@/app/lib/home/home-view";
import { gameCountsQueryOptions } from "@/app/lib/queries/game-counts";
import { useScoreboard } from "@/app/lib/queries/use-scoreboard";
import { useBrowserTimeZone } from "@/app/lib/time/use-browser-time-zone";
import DateRail from "@/app/components/DateRail";
import GamesList from "@/app/components/GamesList";
import DateHeading from "./DateHeading";

type DayScoreboardProps = {
  nbaDate: NbaDate;
  today: NbaDate;
};

export default function DayScoreboard({ nbaDate, today }: DayScoreboardProps) {
  const {
    data: scoreboard,
    dataUpdatedAt,
    error,
    isFetching,
    isRefetchError,
    refetch,
  } = useScoreboard(nbaDate);
  const { firstDate, lastDate } = dateRailRange(nbaDate);
  const { data: gameCounts } = useQuery(
    gameCountsQueryOptions(firstDate, lastDate),
  );
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
    today,
    query,
    gameCounts: gameCounts ?? null,
    now: new Date(),
    timeZone,
  });

  return (
    <section className="flex flex-col gap-6 py-6 md:py-8">
      <DateHeading heading={homeView.heading} summary={homeView.summary} />
      <DateRail rail={homeView.dateRail} />
      <GamesList
        nbaDate={nbaDate}
        screen={homeView.screen}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    </section>
  );
}
