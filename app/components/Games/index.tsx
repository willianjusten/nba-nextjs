"use client";

import useSWR from "swr";

import { DateSelector, GamesList } from "@/app/components";
import { getDays, ParsedGames } from "@/app/helpers";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

function Games() {
  const { data } = useSWR<ParsedGames>("/api/today", fetcher, {
    refreshInterval: 15000,
  });
  const { day, prevDay, nextDay } = getDays(data?.gameDate);

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />
      <GamesList games={data?.games} />
    </>
  );
}

export default Games;
