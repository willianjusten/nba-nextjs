"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import {
  buildHomeView,
  dateRailRange,
  isInDateRail,
  type GameFilter,
  nbaDateOfPath,
  type ScoreboardQueryState,
} from "@/app/lib/home/home-view";
import { useFavoriteTeamIds } from "@/app/lib/favorites/use-favorite-team-ids";
import { gameCountsQueryOptions } from "@/app/lib/queries/game-counts";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { seasonCalendarQueryOptions } from "@/app/lib/queries/season-calendar";
import { teamsQueryOptions } from "@/app/lib/queries/teams";
import { seasonStartYearOf } from "@/app/lib/season/season-year";
import { useScoreboard } from "@/app/lib/queries/use-scoreboard";
import { strings } from "@/app/lib/strings";
import { useBrowserTimeZone } from "@/app/lib/time/use-browser-time-zone";
import DatePicker from "@/app/components/DatePicker";
import DateRail from "@/app/components/DateRail";
import GameFilters from "@/app/components/GameFilters";
import GamesList from "@/app/components/GamesList";
import MyTeamsStrip from "@/app/components/MyTeamsStrip";
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
  // The rail stays put while days on it are chosen, and recenters, as if the page opened there, on a day off it.
  const [railCenterDate, setRailCenterDate] = useState(initialDate);
  if (!isInDateRail(selectedDate, railCenterDate)) {
    setRailCenterDate(selectedDate);
  }
  const { firstDate, lastDate } = dateRailRange(railCenterDate);
  const [filter, setFilter] = useState<GameFilter>("all");
  const [filteredDate, setFilteredDate] = useState(selectedDate);
  if (filteredDate !== selectedDate) {
    setFilteredDate(selectedDate);
    setFilter("all");
  }
  const { data: gameCounts } = useQuery(
    gameCountsQueryOptions(firstDate, lastDate),
  );
  const { data: seasonCalendar } = useQuery(
    seasonCalendarQueryOptions(seasonStartYearOf(selectedDate)),
  );
  const favoriteTeamIds = useFavoriteTeamIds();
  // Only favorites need the teams list, to resolve their names and logos.
  const { data: teams, isError: isTeamsError } = useQuery({
    ...teamsQueryOptions(),
    enabled: favoriteTeamIds.length > 0,
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
    railCenterDate,
    today,
    query,
    filter,
    gameCounts: gameCounts ?? null,
    seasonCalendar: seasonCalendar ?? null,
    favoriteTeamIds,
    // A failed teams list falls back to the add button instead of an empty strip.
    teams: teams ?? (isTeamsError ? [] : null),
    now: new Date(),
    timeZone,
  });

  const selectDay = (day: { href: string; isSelected: boolean }) => {
    if (!day.isSelected) window.history.pushState(null, "", day.href);
  };
  const datePickerProps = {
    selectedDate,
    today,
    onSelect: selectDay,
  };

  return (
    <section className="flex flex-col gap-6 py-6 md:py-8">
      <DateHeading
        heading={homeView.heading}
        summary={homeView.summary}
        myTeams={<MyTeamsStrip teams={homeView.myTeams} />}
      >
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
      {homeView.filters && (
        <GameFilters
          filters={homeView.filters}
          countLabel={
            homeView.summary &&
            strings.dateRail.gameCount(homeView.summary.total)
          }
          onSelect={setFilter}
        />
      )}
      <GamesList
        nbaDate={selectedDate}
        screen={homeView.screen}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    </section>
  );
}
