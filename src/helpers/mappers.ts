import { Games, Team } from "@/app/api/types";

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

  const STATUS = {
    SOON: 1,
    NOW: 2,
    FINISHED: 3,
  };

  const orderByStatus = (a, b) => {
    const PRIORITY = {
      [STATUS.NOW]: 0,
      [STATUS.SOON]: 1,
      [STATUS.FINISHED]: 2,
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
