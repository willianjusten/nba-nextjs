"use client";

import useSWR from "swr";
import { GameCard } from "@/components/game-card";
import { DateSelector } from "@/components/date-selector";
import { getDays } from "@/helpers/date";

//TODO: Duplicate type definition, should be in a shared file
type GameTeam = {
  teamId: number;
  teamName: string;
  score: number;
  wins?: number;
  losses?: number;
};

type Games = {
  gameId: string;
  awayTeam: GameTeam;
  homeTeam: GameTeam;
  gameStatus: number;
  gameStatusText: string;
  gameTimeUTC: string;
  period: string;
  details?: boolean;
  interactive?: boolean;
}[];

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day, prevDay, nextDay } = getDays();
  const { data, error } = useSWR<Games>(`/api/today`, fetcher, {
    refreshInterval: 20000,
  });

  if (error) {
    throw error;
  }

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />

      <main className="grid-cols-auto-fill grid gap-5">
        {data
          ?.sort((a, b) => a.gameStatus - b.gameStatus)
          .map((game) => <GameCard key={game.gameId} {...game} />)}
      </main>
    </>
  );
}
