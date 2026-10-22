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
    error: "Couldn't load games. Try again in a moment.",
    empty: "No games scheduled for this day.",
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
  game: {
    title: (gameId: string) => `Game ${gameId}`,
  },
  standings: {
    title: "Standings",
  },
  team: {
    title: (slug: string) => `Team ${slug}`,
  },
  playoffs: {
    title: "Playoffs",
  },
} as const;
