"use client";

import type { NbaDate } from "@/app/lib/domain/nba-date";
import { useScoreboard } from "@/app/lib/queries/use-scoreboard";
import GameCard from "@/app/components/GameCard";
import {
  GAMES_GRID_CLASS_NAME,
  GamesListEmpty,
  GamesListError,
  GamesListLoading,
  StaleScoresNotice,
} from "./states";

export default function GamesList({ nbaDate }: { nbaDate: NbaDate }) {
  const {
    data: scoreboard,
    dataUpdatedAt,
    error,
    isFetching,
    isRefetchError,
    refetch,
  } = useScoreboard(nbaDate);

  // Data is checked before the error: a failed refetch keeps the last valid scoreboard instead of hiding it.
  if (scoreboard) {
    if (scoreboard.games.length === 0) {
      return (
        <GamesListEmpty
          nbaDate={nbaDate}
          nextGameDate={scoreboard.nextGameDate}
        />
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {isRefetchError && <StaleScoresNotice updatedAt={dataUpdatedAt} />}
        <div className={GAMES_GRID_CLASS_NAME}>
          {scoreboard.games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <GamesListError onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  return <GamesListLoading />;
}
