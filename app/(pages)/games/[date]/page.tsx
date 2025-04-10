import { GamesList, DateSelector } from "@/app/components";
import { API, DATE_TITLE_FORMAT } from "@/app/constants";
import { getDays, parseGames } from "@/app/helpers";
import { format } from "date-fns/format";
import { Metadata } from "next";

async function getData(date: string) {
  const res = await fetch(
    `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();
  return parseGames(data);
}

type GamesProps = {
  params: {
    date: string;
  };
};

export async function generateMetadata({
  params,
}: GamesProps): Promise<Metadata> {
  const date = params.date;

  return {
    title: `Games for ${format(date, DATE_TITLE_FORMAT)} | NBA Next.js`,
    description: `See the current games for ${format(date, DATE_TITLE_FORMAT)}`,
  };
}

async function Games({ params: { date } }: GamesProps) {
  const data = await getData(date);
  const { day, prevDay, nextDay } = getDays(data?.gameDate);

  return (
    <>
      <DateSelector day={day} prevDay={prevDay} nextDay={nextDay} />
      <GamesList games={data?.games} />
    </>
  );
}

export default Games;
