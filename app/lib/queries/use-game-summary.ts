import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GameSummary } from "@/app/lib/domain/game-summary";
import { gameSummaryQueryOptions } from "./game-summary";
import { livePollingOptions, usePollingWindowRecheck } from "./live-polling";

const gamesOfSummary = (summary: GameSummary | undefined) =>
  summary ? [summary.game] : [];

export function useGameSummary(gameId: string) {
  const gameSummaryQuery = useQuery({
    ...gameSummaryQueryOptions(gameId),
    ...livePollingOptions(gamesOfSummary, "game-detail"),
  });

  const game = gameSummaryQuery.data?.game;
  usePollingWindowRecheck(useMemo(() => (game ? [game] : undefined), [game]));

  return gameSummaryQuery;
}
