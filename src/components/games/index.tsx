"use client";

import Link from "next/link";
import useSWR from "swr";

import { GameCard } from "@/components";
import { DateSelector } from "@/components";
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
  const { data } = useSWR<Games>("/api/today", fetcher, {
    refreshInterval: 15000,
  });

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />

      <main className="grid-cols-auto-fill grid gap-5">
        {data
          ?.sort((a, b) => a.gameStatus - b.gameStatus)
          .map((game) => (
            <Link key={game.gameId} href={`/game/${game.gameId}`}>
              <GameCard {...game} />
            </Link>
          ))}
      </main>
    </>
  );
}
