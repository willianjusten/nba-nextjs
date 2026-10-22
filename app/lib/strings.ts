export const strings = {
  app: {
    name: "NBA Next.js",
    description: "NBA scores, standings, and playoffs.",
  },
  common: {
    comingSoon: "Coming soon.",
  },
  home: {
    title: "Today's games",
  },
  games: {
    title: (formattedDate: string) => `Games on ${formattedDate}`,
    loading: "Loading games...",
    error: "We couldn't load the games right now.",
    retry: "Try again",
    retrying: "Trying again...",
    empty: "No games scheduled for this day.",
    stale: "Scores may be out of date. Retrying automatically.",
  },
  gameStatus: {
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
