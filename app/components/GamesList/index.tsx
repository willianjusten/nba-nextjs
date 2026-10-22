"use client";

import { useQuery } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { strings } from "@/app/lib/strings";
import GameCard from "@/app/components/GameCard";

export default function GamesList({ nbaDate }: { nbaDate: NbaDate }) {
  const {
    data: scoreboard,
    isPending,
    isError,
  } = useQuery(scoreboardQueryOptions(nbaDate));

  if (isPending) return <p>{strings.games.loading}</p>;
  if (isError) return <p role="alert">{strings.games.error}</p>;
  if (scoreboard.games.length === 0) return <p>{strings.games.empty}</p>;

  return (
    <div className="grid grid-cols-auto-fill gap-4">
      {scoreboard.games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
