export const API = {
  BASE_URL: "https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats",
  DETAILS_URL: "https://cdn.nba.com/static/json/liveData",
  PLAYOFFS_URL: "https://cdn.nba.com/static/json/staticData",
  GAME_CARD_URL:
    "https://proxy.boxscores.site/?apiUrl=core-api.nba.com/cp/api/v1.9/feeds/gamecardfeed",
};

export const COVID_YEAR = 2020;
export const COVID_MONTH_END = 9;
export const REGULAR_MONTH_END = 5;
export const REGULAR_PERIOD_COUNT = 4;

export const EST_IANA_ZONE_ID = "America/New_York";
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

export const TEAM_ID = {
  "1610612737": "Hawks",
  "1610612751": "Nets",
  "1610612738": "Celtics",
  "1610612766": "Hornets",
  "1610612741": "Bulls",
  "1610612739": "Cavaliers",
  "1610612742": "Mavericks",
  "1610612743": "Nuggets",
  "1610612765": "Pistons",
  "1610612744": "Warriors",
  "1610612745": "Rockets",
  "1610612754": "Pacers",
  "1610612746": "Clippers",
  "1610612747": "Lakers",
  "1610612763": "Grizzlies",
  "1610612748": "Heat",
  "1610612749": "Bucks",
  "1610612750": "Timberwolves",
  "1610612740": "Pelicans",
  "1610612752": "Knicks",
  "1610612760": "Thunder",
  "1610612753": "Magic",
  "1610612755": "76ers",
  "1610612756": "Suns",
  "1610612757": "Trail Blazers",
  "1610612758": "Kings",
  "1610612759": "Spurs",
  "1610612761": "Raptors",
  "1610612762": "Jazz",
  "1610612764": "Wizards",
};
