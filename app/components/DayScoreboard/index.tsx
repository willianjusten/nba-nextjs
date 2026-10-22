import type { NbaDate } from "@/app/lib/domain/nba-date";
import { formatNbaDate } from "@/app/lib/time/nba-date";
import GamesList from "@/app/components/GamesList";

type DayScoreboardProps = {
  title: string;
  nbaDate: NbaDate;
};

export default function DayScoreboard({ title, nbaDate }: DayScoreboardProps) {
  return (
    <section className="flex flex-col gap-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-slate-300">{formatNbaDate(nbaDate)}</p>
      </header>
      <GamesList nbaDate={nbaDate} />
    </section>
  );
}
