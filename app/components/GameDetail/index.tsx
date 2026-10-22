"use client";

import { useGameSummary } from "@/app/lib/queries/use-game-summary";
import {
  BoxScore,
  GameHeader,
  GameLeaders,
  LineScore,
  PlayByPlay,
  WinProbability,
} from "./sections";
import { GameDetailError, GameDetailLoading, StaleGameNotice } from "./states";

export default function GameDetail({ gameId }: { gameId: string }) {
  const {
    data: summary,
    error,
    isFetching,
    isRefetchError,
    refetch,
  } = useGameSummary(gameId);

  // Data is checked before the error: a failed refetch keeps the last valid summary instead of hiding it.
  if (summary) {
    const { game } = summary;

    return (
      <div className="flex flex-col gap-8">
        {isRefetchError && <StaleGameNotice />}
        <GameHeader game={game} />
        <LineScore game={game} lineScore={summary.lineScore} />
        <GameLeaders game={game} leaders={summary.leaders} />
        <WinProbability game={game} points={summary.winProbability} />
        <BoxScore team={game.away.team} boxScore={summary.boxScore.away} />
        <BoxScore team={game.home.team} boxScore={summary.boxScore.home} />
        <PlayByPlay game={game} plays={summary.plays} />
      </div>
    );
  }

  if (error) {
    return (
      <GameDetailError onRetry={() => refetch()} isRetrying={isFetching} />
    );
  }

  return <GameDetailLoading />;
}
