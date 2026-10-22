"use client";

import { useQuery } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import GameCard from "@/app/components/GameCard";
import {
  GAMES_GRID_CLASS_NAME,
  GamesListEmpty,
  GamesListError,
  GamesListLoading,
} from "./states";

export default function GamesList({ nbaDate }: { nbaDate: NbaDate }) {
  const {
    data: scoreboard,
    error,
    isFetching,
    refetch,
  } = useQuery(scoreboardQueryOptions(nbaDate));

  // Data is checked before the error: a failed refetch keeps the last valid scoreboard instead of hiding it.
  if (scoreboard) {
    if (scoreboard.games.length === 0) return <GamesListEmpty />;

    return (
      <div className={GAMES_GRID_CLASS_NAME}>
        {scoreboard.games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    );
  }

  if (error) {
    return <GamesListError onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  return <GamesListLoading />;
}
