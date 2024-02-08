import { getLeagueYear } from "@/helpers/date";
import { API } from "@/constants";
import { SwitchConference } from "@/components";
import { conferenceExtractor } from "@/helpers/mappers";

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
    }
  );

  const data = await res.json();

  return {
    east: conferenceExtractor(data.resultSets[0].rowSet, true),
    west: conferenceExtractor(data.resultSets[0].rowSet, false),
  };
}

export default async function Standings() {
  const { east, west } = await getData();

  return <SwitchConference east={east} west={west} />;
}
