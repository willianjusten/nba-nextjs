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
    title: (gameId: string) => `Game ${gameId}`,
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
