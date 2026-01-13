import { Broadcaster, Games, PlayoffBracketData, Team } from "@/app/api/types";
import { orderByStatus } from "@/app/helpers";

export type ParsedGames = ReturnType<typeof parseGames>;

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

const parseGameData = (games: any[]) => {
  return games.sort(orderByStatus).map((game) => {
    const {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC,
      gameTimeUtc,
      homeTeam,
      awayTeam,
      broadcasters,
    } = game;

    // const broadcaster = getBroadcaster(broadcasters?.nationalBroadcasters);

    return {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC: gameTimeUTC || gameTimeUtc,
      broadcaster: "",
      homeTeam: getTeamData(homeTeam),
      awayTeam: getTeamData(awayTeam),
    };
  });
};

export const parseGames = (data: Games) => {
  const {
    scoreboard: { gameDate, games },
  } = data;

  return {
    gameDate,
    games: parseGameData(games),
  };
};

export const parsePreviousGames = (data: any[], gameDate: string) => {
  const games = data.map((card) => card.cardData);

  return {
    gameDate,
    games: parseGameData(games),
  };
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

export function formatPlayoffData(data: PlayoffBracketData) {
  const { playoffBracketSeries } = data.bracket;

  const rounds = {
    east: {
      firstRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 1 && s.seriesConference === "East",
      ),
      secondRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 2 && s.seriesConference === "East",
      ),
      thirdRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 3 && s.seriesConference === "East",
      ),
    },
    west: {
      firstRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 1 && s.seriesConference === "West",
      ),
      secondRound: playoffBracketSeries.filter(
        (s) => s.roundNumber === 2 && s.seriesConference === "West",
      ),
      thirdRound: playoffBracketSeries.filter(
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

/**
 * This mapper is very generic and works mostly for the playoffs / national
 * broadcasters. I wasn't able to identify a pattern for the regular season
 * broadcasters, prime video doesn't have anything that identifies properly,
 * but since for the playoffs we have the partnerships like TNT/TruTV/Max,
 * we can identify them by that.
 */
const getBroadcaster = (broadcasters: Broadcaster[]) => {
  const espn = broadcasters?.find(
    (b) =>
      b?.broadcastDisplay.includes("ESPN") ||
      b?.broadcastDisplay.includes("ABC"),
  );
  const primeVideo = broadcasters?.find((b) =>
    b?.broadcastDisplay.includes("TNT/truTV/Max"),
  );

  if (espn) return "ESPN";
  if (primeVideo) return "Prime Video";
  return "";
};
