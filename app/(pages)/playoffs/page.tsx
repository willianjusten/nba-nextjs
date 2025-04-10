import { PlayoffsTable } from "@/app/components";
import { API } from "@/app/constants";
import { getLeagueYear } from "@/app/helpers";
import { Metadata } from "next";
import { Suspense } from "react";

function formatPlayoffData(data) {
  const { playoffBracketSeries } = data.bracket;

  const rounds = {
    east: {
      firstRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 1 && s.seriesConference === "East",
      ),
      semifinals: playoffBracketSeries.filter(
        (s) => s.roundNumber === 2 && s.seriesConference === "East",
      ),
      finals: playoffBracketSeries.filter(
        (s) => s.roundNumber === 3 && s.seriesConference === "East",
      ),
    },
    west: {
      firstRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 1 && s.seriesConference === "West",
      ),
      semifinals: playoffBracketSeries.filter(
        (s) => s.roundNumber === 2 && s.seriesConference === "West",
      ),
      finals: playoffBracketSeries.filter(
        (s) => s.roundNumber === 3 && s.seriesConference === "West",
      ),
    },
    nbaFinals: playoffBracketSeries.filter((s) => s.roundNumber === 4),
  };

  rounds.east.firstRound.sort(
    (a, b) => a.displayOrderNumber - b.displayOrderNumber,
  );
  rounds.west.firstRound.sort(
    (a, b) => a.displayOrderNumber - b.displayOrderNumber,
  );

  return rounds;
}

async function getData() {
  const year = getLeagueYear(new Date());

  const res = await fetch(
    `${API.PLAYOFFS_URL}/brackets/${year}/PlayoffBracket.json`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  const data = await res.json();

  return formatPlayoffData(data);
}

export const metadata: Metadata = {
  title: "Playoffs | NBA Next.js",
  description: "See the current Playoffs for NBA",
};

async function Playoffs() {
  const { east, west, nbaFinals } = await getData();

  return (
    <Suspense>
      <PlayoffsTable east={east} west={west} nbaFinals={nbaFinals} />
    </Suspense>
  );
}
export default Playoffs;
