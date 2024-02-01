"use client";

import useSWR from "swr";
import { GameCard } from "@/components/GameCard";
import { DateSelector } from "@/components/DateSelector";
import { getDays } from "@/helpers/date";
import Link from "next/link";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day, prevDay, nextDay } = getDays();
  const { data } = useSWR(`/api/today`, fetcher, {
    refreshInterval: 20000,
  });

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />

      <main className="grid grid-cols-auto-fill gap-5">
        {data
          ?.sort((a, b) => a.gameStatus - b.gameStatus)
          .map((game) => (
            <Link key={game.gameId} href={`/game/${game.gameId}`}>
              <GameCard key={game.gameId} {...game} />
            </Link>
          ))}
      </main>
    </>
  );
}
