import ConferenceStandings from "@/app/components/ConferenceStandings";
import { fetchStandings } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";

// Standings change after every game, so the page cannot be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const { season, conferences } = await fetchStandings();

  return (
    <section className="flex flex-col gap-8 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{strings.standings.title}</h1>
        <p className="text-slate-300">
          {strings.standings.regularSeason(season.displayName)}
        </p>
      </header>
      {conferences.map((conference) => (
        <ConferenceStandings key={conference.id} conference={conference} />
      ))}
    </section>
  );
}
