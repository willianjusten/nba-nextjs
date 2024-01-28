"use client";

import { getDays } from "@/helpers/date";
import useSWR from "swr";
import { GameCard } from "@/components/GameCard";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day } = getDays();
  const { data, error } = useSWR(`/api/games/${day}`, fetcher, {
    refreshInterval: 20000,
  });

  if (error) {
    throw error;
  }

  return (
    <main className="grid grid-cols-auto-fill gap-5">
      {data?.map((game) => (
        <GameCard key={game.gameId} {...game} />
      ))}
    </main>
  );
}
