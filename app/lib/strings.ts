import type { GamesSummary } from "@/app/lib/home/home-view";
import type { SidebarRunnerUp } from "@/app/lib/home/sidebar";

export const strings = {
  app: {
    name: "NBA Next.js",
    description: "NBA scores, standings, and playoffs.",
  },
  common: {
    comingSoon: "Coming soon.",
  },
  shell: {
    logoLabel: "NBA home",
    primaryNavigation: "Primary",
    bottomNavigation: "Sections",
    sections: {
      games: "Games",
      standings: "Standings",
      playoffs: "Playoffs",
    },
    footer: "Create with s2 by Willian Justen, Marcus, Bruna",
  },
  home: {
    summary: ({ total, live, final }: GamesSummary) =>
      [
        `${total} ${total === 1 ? "game" : "games"}`,
        live > 0 && `${live} live`,
        final > 0 && `${final} final`,
      ]
        .filter(Boolean)
        .join(" · "),
    sidebar: {
      label: "Standings and league leaders",
      topFive: (conferenceAbbreviation: string) =>
        `${conferenceAbbreviation} top 5`,
      allStandings: "All",
      allStandingsLabel: "All standings",
      standingsError: "We couldn't load the standings right now.",
      favorite: "Favorite team",
      leadersTitle: "League leaders",
      categories: {
        points: "Points / game",
        rebounds: "Rebounds / game",
        assists: "Assists / game",
      },
      runnerUp: ({ rank, shortName, displayValue }: SidebarRunnerUp) =>
        `${rank}. ${shortName} ${displayValue}`,
    },
  },
  myTeams: {
    label: "My teams",
    pick: "Pick my teams",
    pickerTitle: "Follow teams",
    follow: (teamName: string) => `Follow ${teamName}`,
    favorite: "Favorite",
    loading: "Loading teams...",
    error: "Couldn't load the teams",
    unpersisted: "Favorites won't be saved in this browser.",
  },
  dateRail: {
    label: "Choose a date",
    previousDays: "Show earlier days",
    nextDays: "Show later days",
    gameCount: (count: number) =>
      count === 0 ? "No games" : `${count} ${count === 1 ? "game" : "games"}`,
    dayLabel: (formattedDate: string, countLabel: string | null) =>
      countLabel ? `${formattedDate}, ${countLabel}` : formattedDate,
  },
  gameFilters: {
    heading: "Scoreboard",
    groupLabel: "Filter games",
    all: "All",
    live: "Live",
    final: "Final",
    upcoming: "Upcoming",
    empty: {
      all: (formattedDate: string) => `No games on ${formattedDate}`,
      live: (formattedDate: string) => `No live games on ${formattedDate}`,
      final: (formattedDate: string) => `No final games on ${formattedDate}`,
      upcoming: (formattedDate: string) =>
        `No upcoming games on ${formattedDate}`,
    },
  },
  calendar: {
    pickDate: "Pick date",
    pickDateLabel: "Pick a date",
    openCalendar: "Open calendar",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["S", "M", "T", "W", "T", "F", "S"],
    dayLabel: (formattedDate: string, hasGames: boolean) =>
      hasGames ? `${formattedDate}, Game day` : formattedDate,
  },
  games: {
    loading: "Loading games...",
    error: "Couldn't load the games",
    errorDetail:
      "The data source didn't respond. This isn't a day without games.",
    retry: "Try again",
    retrying: "Trying again...",
    empty: (formattedDate: string) => `No games on ${formattedDate}`,
    nextGames: (formattedDate: string) => `Next games: ${formattedDate}`,
    stale: (minutesAgo: number) =>
      `Can't reach live data. Showing scores from ${minutesAgo} min ago.`,
    retryingAutomatically: "retrying…",
  },
  gameCard: {
    at: "at",
    winner: "Winner",
    highlights: "Highlights · recap",
    gameDetails: "Game details",
    gamePreview: "Game preview",
    winProbability: "Win probability",
    teamWinProbability: (abbreviation: string, percent: number) =>
      `${abbreviation} ${percent}%`,
    topScorer: "Top scorer",
    points: (points: number) => `${points} PTS`,
  },
  gameStatus: {
    live: "Live",
    postponedShort: "PPD",
    quarter: (period: number) => `Q${period}`,
    overtime: (overtimeNumber: number) =>
      overtimeNumber === 1 ? "OT" : `${overtimeNumber}OT`,
    halftime: "Halftime",
    final: "Final",
    finalAfter: (periodLabel: string) => `Final/${periodLabel}`,
    postponed: "Postponed",
    canceled: "Canceled",
  },
  broadcast: {
    label: "Broadcast: ",
    separator: " · ",
  },
  game: {
    title: (awayTeamName: string, homeTeamName: string) =>
      `${awayTeamName} at ${homeTeamName}`,
    loading: "Loading game...",
    error: "We couldn't load this game right now.",
    retry: "Try again",
    retrying: "Trying again...",
    stale: "Game data may be out of date. Retrying automatically.",
    lineScore: {
      title: "Line score",
      team: "Team",
      total: "T",
    },
    leaders: {
      title: "Game leaders",
      empty: "No leaders yet.",
    },
    boxScore: {
      title: (teamName: string) => `${teamName} box score`,
      player: "Player",
      totals: "Totals",
      didNotPlay: (reason: string) => `DNP - ${reason}`,
      columns: {
        minutes: "MIN",
        points: "PTS",
        fieldGoals: "FG",
        threePointers: "3PT",
        freeThrows: "FT",
        rebounds: "REB",
        offensiveRebounds: "OREB",
        defensiveRebounds: "DREB",
        assists: "AST",
        steals: "STL",
        blocks: "BLK",
        turnovers: "TO",
        fouls: "PF",
        plusMinus: "+/-",
      },
    },
    plays: {
      title: "Plays",
      empty: "No plays yet.",
      score: (awayScore: number, homeScore: number) =>
        `${awayScore}-${homeScore}`,
    },
    winProbability: {
      title: "Win probability",
      empty: "Win probability is not available yet.",
      chance: (teamAbbreviation: string, formattedPercent: string) =>
        `${teamAbbreviation} ${formattedPercent}`,
    },
  },
  standings: {
    title: "Standings",
    regularSeason: (seasonName: string) => `${seasonName} Regular Season`,
    columns: {
      seed: "#",
      team: "Team",
      wins: "W",
      losses: "L",
      winPercent: "PCT",
      gamesBehind: "GB",
      home: "Home",
      road: "Away",
      lastTen: "L10",
      streak: "Strk",
    },
    leaderGamesBehind: "-",
    noStreak: "-",
  },
  leaders: {
    title: "League Leaders",
    categories: {
      points: { title: "Points", unit: "PPG" },
      rebounds: { title: "Rebounds", unit: "RPG" },
      assists: { title: "Assists", unit: "APG" },
    },
    empty: "No leaders yet.",
    error: "We couldn't load the league leaders right now.",
    categoryError: "We couldn't load these leaders right now.",
  },
  team: {
    record: (record: string) => `Record ${record}`,
    schedule: {
      results: "Results",
      upcoming: "Upcoming",
      noResults: "No games played yet.",
      noUpcoming: "No upcoming games.",
      versus: (opponentName: string) => `vs ${opponentName}`,
      at: (opponentName: string) => `@ ${opponentName}`,
      result: (won: boolean, teamScore: number, opponentScore: number) =>
        `${won ? "W" : "L"} ${teamScore}-${opponentScore}`,
      inProgress: "In progress",
    },
    roster: {
      title: "Roster",
      jersey: "#",
      player: "Player",
      position: "Pos",
      height: "Ht",
      weight: "Wt",
      age: "Age",
    },
  },
  playoffs: {
    title: "Playoffs",
  },
} as const;
