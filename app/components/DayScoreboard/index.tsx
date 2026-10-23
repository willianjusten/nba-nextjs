"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  buildHomeView,
  dateRailRange,
  nbaDateOfPath,
  type ScoreboardQueryState,
} from "@/app/lib/home/home-view";
import { gameCountsQueryOptions } from "@/app/lib/queries/game-counts";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { seasonCalendarQueryOptions } from "@/app/lib/queries/season-calendar";
import { useScoreboard } from "@/app/lib/queries/use-scoreboard";
import { useBrowserTimeZone } from "@/app/lib/time/use-browser-time-zone";
import DatePicker from "@/app/components/DatePicker";
import DateRail from "@/app/components/DateRail";
import GamesList from "@/app/components/GamesList";
import DateHeading from "./DateHeading";

type DayScoreboardProps = {
  initialDate: NbaDate;
  today: NbaDate;
};

export default function DayScoreboard({
  initialDate,
  today,
}: DayScoreboardProps) {
  // Days are chosen through native history calls, which Next.js mirrors in usePathname without a server round trip.
  const selectedDate = nbaDateOfPath(usePathname(), today) ?? initialDate;
  const queryClient = useQueryClient();
  const {
    data: scoreboard,
    dataUpdatedAt,
    error,
    isFetching,
    isRefetchError,
    refetch,
  } = useScoreboard(selectedDate);
  const { firstDate, lastDate } = dateRailRange(initialDate);
  const { data: gameCounts } = useQuery(
    gameCountsQueryOptions(firstDate, lastDate),
  );
  // The previous day's calendar stays while the next one loads, but only when it covers the new day, so another season's days are never marked.
  const { data: seasonCalendar } = useQuery({
    ...seasonCalendarQueryOptions(selectedDate),
    placeholderData: (previousCalendar) =>
      previousCalendar?.length &&
      previousCalendar[0] <= selectedDate &&
      selectedDate <= previousCalendar[previousCalendar.length - 1]
        ? previousCalendar
        : undefined,
  });
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
    selectedDate,
    railCenterDate: initialDate,
    today,
    query,
    gameCounts: gameCounts ?? null,
    seasonCalendar: seasonCalendar ?? null,
    now: new Date(),
    timeZone,
  });

  const selectDay = (day: { href: string; isSelected: boolean }) => {
    if (!day.isSelected) window.history.pushState(null, "", day.href);
  };
  const datePickerProps = {
    selectedDate,
    today,
    seasonCalendar: seasonCalendar ?? null,
    onSelect: selectDay,
  };

  return (
    <section className="flex flex-col gap-6 py-6 md:py-8">
      <DateHeading heading={homeView.heading} summary={homeView.summary}>
        <DatePicker placement="header" {...datePickerProps} />
      </DateHeading>
      <DateRail
        rail={homeView.dateRail}
        onSelect={selectDay}
        onPreview={(day) =>
          queryClient.prefetchQuery(scoreboardQueryOptions(day.nbaDate))
        }
      >
        <DatePicker placement="rail" {...datePickerProps} />
      </DateRail>
      <GamesList
        nbaDate={selectedDate}
        screen={homeView.screen}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    </section>
  );
}
