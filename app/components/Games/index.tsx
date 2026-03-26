"use client";

import { useQuery } from "@tanstack/react-query";

import { DateSelector, GamesList } from "@/app/components";
import { getDays, ParsedGames } from "@/app/helpers";

const fetcher = async (): Promise<ParsedGames> => {
  const res = await fetch("/api/today");
  return res.json();
};

function Games() {
  const { data } = useQuery<ParsedGames>({
    queryKey: ["today"],
    queryFn: fetcher,
    refetchInterval: 15000,
    staleTime: 15000,
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
