export type LeaderStat = "points" | "rebounds" | "assists";

export type LeaderAthlete = {
  id: string;
  displayName: string;
  headshotUrl: string | null;
};

export type Leader = {
  athlete: LeaderAthlete;
  // Per-game average, e.g. 31.4.
  value: number;
  displayValue: string;
};

export type LeaderCategory = {
  stat: LeaderStat;
  // Best first. Empty before any regular season game has been played; null when the category's athletes could not be loaded.
  leaders: Leader[] | null;
};
