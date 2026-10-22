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
    title: (date: string) => `Games on ${date}`,
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
