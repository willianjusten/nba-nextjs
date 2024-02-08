"use client";

import useSWR from "swr";

import { DateSelector, GamesList } from "@/components";
import { getDays } from "@/helpers/date";
import { ParsedGames } from "@/helpers/mappers";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day, prevDay, nextDay } = getDays();
  const { data } = useSWR<ParsedGames>("/api/today", fetcher, {
    refreshInterval: 15000,
  });

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />
      <GamesList games={data} />
    </>
  );
}
