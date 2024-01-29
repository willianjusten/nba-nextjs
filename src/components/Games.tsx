"use client";

import useSWR from "swr";
import { GameCard } from "@/components/GameCard";
import { DateSelector } from "@/components/DateSelector";
import { getDays } from "@/helpers/date";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day, prevDay, nextDay } = getDays();
  const { data, error } = useSWR(`/api/today`, fetcher, {
    refreshInterval: 20000,
  });

  if (error) {
    throw error;
  }

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />

      <main className="grid grid-cols-auto-fill gap-5">
        {data
          ?.sort((a, b) => a.gameStatus - b.gameStatus)
          .map((game) => (
            <GameCard key={game.gameId} {...game} />
          ))}
      </main>
    </>
  );
}
