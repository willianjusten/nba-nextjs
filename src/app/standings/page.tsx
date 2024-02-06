import { getLeagueYear } from "@/helpers/date";
import { API } from "@/constants";
import { SwitchConference }from "@/components";

const conferenceExtractor = (teams, isEast) =>
  teams
    .filter((team) => (isEast ? team[6] === "East" : team[6] === "West"))
    .map((team) => ({
      name: team[4],
      id: team[2],
      playoffCode: team[9],
      win: team[13],
      loss: team[14],
      percentage: team[15],
      gamesBehind: team[38],
      homeRecord: team[18],
      awayRecord: team[19],
      lastTenRecord: team[20],
      streak: team[36],
    }));

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

  return (
    <>
      <SwitchConference east={east} west={west} />
    </>
  );
}
