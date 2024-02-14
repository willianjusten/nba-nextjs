export const API = {
  BASE_URL: "https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats",
  DETAILS_URL: "https://cdn.nba.com/static/json/liveData",
};

export const COVID_YEAR = 2020;
export const COVID_MONTH_END = 9;
export const REGULAR_MONTH_END = 5;
export const REGULAR_PERIOD_COUNT = 4;

export const DATE_DISPLAY_FORMAT = "dd MMMM yyyy";
export const DATE_LINK_FORMAT = "yyyy-MM-dd";
export const DATE_TITLE_FORMAT = "dd/MM/yyyy";

export const AWAY_TEAM = "awayTeam";
export const HOME_TEAM = "homeTeam";

export const EAST_CONFERENCE = "east";
export const WEST_CONFERENCE = "west";
export const CONFERENCE_KEY = "conference";

export const GAME_STATUS = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  ENDED: 3,
};

export const PRIORITY = {
  [GAME_STATUS.IN_PROGRESS]: 0,
  [GAME_STATUS.NOT_STARTED]: 1,
  [GAME_STATUS.ENDED]: 2,
};
