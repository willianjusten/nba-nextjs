import Link from "next/link";

import { GameCard } from "@/components";
import { DateSelector } from "@/components";
import { getDays } from "@/helpers/date";
import { API } from "@/constants";
import { parseGames } from "@/helpers/mappers";

async function getData(date: string) {
  const res = await fetch(
    `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  return parseGames(data);
}

type GamesProps = {
  params: {
    date: string;
  };
};

export default async function Games({ params: { date } }: GamesProps) {
  const data = await getData(date);
  const { day, prevDay, nextDay } = getDays(date);

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />
      <main className="grid-cols-auto-fill grid gap-5">
        {data.map((game) => (
          <Link key={game.gameId} href={`/game/${game.gameId}`}>
            <GameCard key={game.gameId} {...game} />
          </Link>
        ))}
      </main>
    </>
  );
}
