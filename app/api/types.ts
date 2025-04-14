export type Games = {
  meta: Meta;
  scoreboard: Scoreboard;
};

export type Meta = {
  version: number;
  request: string;
  time: Date;
};

export type Scoreboard = {
  gameDate: string;
  leagueId: string;
  leagueName: string;
  games: Game[];
};

export type Game = {
  gameId: string;
  gameCode: string;
  gameStatus: number;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: Date;
  gameEt: Date;
  regulationPeriods: number;
  seriesGameNumber: string;
  seriesText: string;
  ifNecessary: boolean;
  seriesConference: string;
  poRoundDesc: string;
  gameSubtype: string;
  gameLeaders: GameLeaders;
  teamLeaders: TeamLeaders;
  broadcasters: Broadcasters;
  homeTeam: Team;
  awayTeam: Team;
};

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export type Player = {
  status: Status;
  order: number;
  personId: number;
  jerseyNum: string;
  position?: string;
  starter: string;
  oncourt: string;
  played: string;
  statistics: PlayerStatistics;
  name: string;
  nameI: string;
  firstName: string;
  familyName: string;
  notPlayingReason?: string;
  notPlayingDescription?: string;
};

export type PlayerStatistics = {
  assists: number;
  blocks: number;
  blocksReceived: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  minus: number;
  minutes: string;
  minutesCalculated: string;
  plus: number;
  plusMinusPoints: number;
  points: number;
  pointsFastBreak: number;
  pointsInThePaint: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsTotal: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  turnovers: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
};

export type TeamStatistics = {
  assists: number;
  assistsTurnoverRatio: number;
  benchPoints: number;
  biggestLead: number;
  biggestLeadScore: string;
  biggestScoringRun: number;
  biggestScoringRunScore: string;
  blocks: number;
  blocksReceived: number;
  fastBreakPointsAttempted: number;
  fastBreakPointsMade: number;
  fastBreakPointsPercentage: number;
  fieldGoalsAttempted: number;
  fieldGoalsEffectiveAdjusted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTeam: number;
  foulsTechnical: number;
  foulsTeamTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  leadChanges: number;
  minutes: string;
  minutesCalculated: string;
  points: number;
  pointsAgainst: number;
  pointsFastBreak: number;
  pointsFromTurnovers: number;
  pointsInThePaint: number;
  pointsInThePaintAttempted: number;
  pointsInThePaintMade: number;
  pointsInThePaintPercentage: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsPersonal: number;
  reboundsTeam: number;
  reboundsTeamDefensive: number;
  reboundsTeamOffensive: number;
  reboundsTotal: number;
  secondChancePointsAttempted: number;
  secondChancePointsMade: number;
  secondChancePointsPercentage: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  timeLeading: string;
  timesTied: number;
  trueShootingAttempts: number;
  trueShootingPercentage: number;
  turnovers: number;
  turnoversTeam: number;
  turnoversTotal: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
};

export type Team = {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  teamSlug: string;
  wins: number;
  losses: number;
  score: number;
  seed: number;
  inBonus: null;
  timeoutsRemaining: number;
  periods: Period[];
  players: Player[];
  statistics: TeamStatistics;
};

export type Period = {
  period: number;
  periodType: string;
  score: number;
};

export type Broadcasters = {
  nationalBroadcasters: Broadcaster[];
  nationalRadioBroadcasters: Broadcaster[];
  nationalOttBroadcasters: any[];
  homeTvBroadcasters: Broadcaster[];
  homeRadioBroadcasters: Broadcaster[];
  homeOttBroadcasters: any[];
  awayTvBroadcasters: Broadcaster[];
  awayRadioBroadcasters: Broadcaster[];
  awayOttBroadcasters: Broadcaster[];
};

export type Broadcaster = {
  broadcasterId: number;
  broadcastDisplay: string;
  broadcasterTeamId: number;
};

export type GameLeaders = {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
};

export type Leaders = {
  personId: number;
  name: string;
  playerSlug: string;
  jerseyNum: string;
  position: string;
  teamTricode: string;
  points: number;
  rebounds: number;
  assists: number;
};

export type TeamLeaders = {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
  seasonLeadersFlag: number;
};

export type PlayoffRound = {
  roundNumber: number;
  displayOrderNumber: number;
  highSeedId: number;
  lowSeedId: number;
  highSeedName?: string;
  lowSeedName?: string;
  highSeedRank: number;
  lowSeedRank: number;
  highSeedSeriesWins: number;
  lowSeedSeriesWins: number;
  seriesWinner: number;
  seriesConference: string;
  seriesText?: string;
};

export type PlayoffBracketData = {
  bracket: {
    playoffBracketSeries: PlayoffRound[];
  };
};

export type PlayoffBracket = {
  east: {
    firstRound: PlayoffRound[];
    secondRound: PlayoffRound[];
    thirdRound: PlayoffRound[];
  };
  west: {
    firstRound: PlayoffRound[];
    secondRound: PlayoffRound[];
    thirdRound: PlayoffRound[];
  };
  nbaFinals: PlayoffRound[];
};
