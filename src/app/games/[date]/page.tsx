import { GamesList, DateSelector } from "@/components";
import { API } from "@/constants";
import { getDays } from "@/helpers/date";
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
      <GamesList games={data} />
    </>
  );
}
