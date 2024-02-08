import { Games, Team } from "@/app/api/types";
import { orderByStatus } from "@/app/helpers";

export type ParsedGames = ReturnType<typeof parseGames>;

export const parseGames = (data: Games) => {
  const {
    scoreboard: { games },
  } = data;

  const getTeamData = (team: Team) => {
    return {
      teamId: team.teamId,
      teamName: team.teamName,
      teamTricode: team.teamTricode,
      wins: team.wins,
      losses: team.losses,
      score: team.score,
    };
  };

  return games.sort(orderByStatus).map((game) => {
    const {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC,
      homeTeam,
      awayTeam,
    } = game;

    return {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC,
      homeTeam: getTeamData(homeTeam),
      awayTeam: getTeamData(awayTeam),
    };
  });
};

export type StandingsData = {
  resultSets: ResultSet[];
};

type ResultSet = {
  name: string;
  headers: string[];
  rowSet: Array<Array<number | string>>;
};

export type Conference = ReturnType<typeof conferenceExtractor>;

export const conferenceExtractor = (
  teams: ResultSet["rowSet"],
  isEast: boolean,
) =>
  teams
    .filter((team) => (isEast ? team[6] === "East" : team[6] === "West"))
    .map((team) => ({
      name: team[4] as string,
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
