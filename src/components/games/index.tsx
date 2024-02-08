"use client";

import useSWR from "swr";

import { DateSelector, GamesList } from "@/components";
import { getDays } from "@/helpers/date";
import { Game } from "@/app/api/types";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day, prevDay, nextDay } = getDays();
  const { data } = useSWR<Game[]>("/api/today", fetcher, {
    refreshInterval: 15000,
  });

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />
      <GamesList games={data} />
    </>
  );
}
