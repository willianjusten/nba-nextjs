import { Games, Team } from "@/app/api/types";
import { GAME_STATUS } from "@/constants";

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

  const orderByStatus = (a, b) => {
    const PRIORITY = {
      [GAME_STATUS.IN_PROGRESS]: 0,
      [GAME_STATUS.NOT_STARTED]: 1,
      [GAME_STATUS.ENDED]: 2,
    };

    return PRIORITY[a.gameStatus] - PRIORITY[b.gameStatus];
  };

  games.sort(orderByStatus);

  return games.map((game) => {
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
