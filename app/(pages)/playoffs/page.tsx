import { Metadata } from "next";
import { Suspense } from "react";
import { PlayoffsTable } from "@/app/components";
import { formatPlayoffData, getLeagueYear } from "@/app/helpers";
import { API } from "@/app/constants";

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

  if (!res.ok) {
    return {
      east: {
        firstRound: [],
        secondRound: [],
        thirdRound: [],
      },
      west: {
        firstRound: [],
        secondRound: [],
        thirdRound: [],
      },
      nbaFinals: [],
    };
  }

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
