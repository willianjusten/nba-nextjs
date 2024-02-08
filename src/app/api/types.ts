export interface Games {
  meta: Meta;
  scoreboard: Scoreboard;
}

export interface Meta {
  version: number;
  request: string;
  time: Date;
}

export interface Scoreboard {
  gameDate: Date;
  leagueId: string;
  leagueName: string;
  games: Game[];
}

export interface Game {
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
}

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export interface Player {
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
}

export interface PlayerStatistics {
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
}

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
};

export interface Period {
  period: number;
  periodType: string;
  score: number;
}

export interface Broadcasters {
  nationalBroadcasters: Broadcaster[];
  nationalRadioBroadcasters: Broadcaster[];
  nationalOttBroadcasters: any[];
  homeTvBroadcasters: Broadcaster[];
  homeRadioBroadcasters: Broadcaster[];
  homeOttBroadcasters: any[];
  awayTvBroadcasters: Broadcaster[];
  awayRadioBroadcasters: Broadcaster[];
  awayOttBroadcasters: Broadcaster[];
}

export interface Broadcaster {
  broadcasterId: number;
  broadcastDisplay: string;
  broadcasterTeamId: number;
}

export interface GameLeaders {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
}

export interface Leaders {
  personId: number;
  name: string;
  playerSlug: string;
  jerseyNum: string;
  position: string;
  teamTricode: string;
  points: number;
  rebounds: number;
  assists: number;
}

export interface TeamLeaders {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
  seasonLeadersFlag: number;
}
