import { API, CONFERENCE_KEY } from "@/app/constants";
import { cookies } from "next/headers";
import { SwitchConference } from "@/app/components";
import { getLeagueYear, conferenceExtractor } from "@/app/helpers";
import { Metadata } from "next";
import { Suspense } from "react";

async function getData() {
  const year = getLeagueYear(new Date());
  const nextYear = (year + 1) % 100;
  const season = `${year}-${nextYear}`;

  const res = await fetch(
    `${API.BASE_URL}/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=${season}&SeasonType=Regular%20Season&Section=overall`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  const data = await res.json();

  return {
    east: conferenceExtractor(data.resultSets[0].rowSet, true),
    west: conferenceExtractor(data.resultSets[0].rowSet, false),
  };
}

export const metadata: Metadata = {
  title: "Standings | NBA Next.js",
  description: "See the current standings for NBA",
};

async function Standings() {
  const { east, west } = await getData();
  const cookieStore = await cookies();
  const initialConference = cookieStore.get(CONFERENCE_KEY)?.value;

  return (
    <Suspense>
      <SwitchConference east={east} west={west} initialConference={initialConference} />
    </Suspense>
  );
}

export default Standings;
