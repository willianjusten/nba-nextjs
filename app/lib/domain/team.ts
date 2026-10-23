import type { Team } from "./game";

// Short lowercase team name, e.g. "lakers" or "trail-blazers". Used in /teams/[slug] URLs.
export type TeamSlug = string;

export type ListedTeam = Team & {
  slug: TeamSlug;
};

export type TeamDetail = ListedTeam & {
  // Overall win-loss record, e.g. "41-12"; null before the team has played.
  record: string | null;
  standingSummary: string | null;
};

export type RosterPlayer = {
  id: string;
  displayName: string;
  jersey: string | null;
  // Position abbreviation, e.g. "G", "F", or "C".
  position: string | null;
  // Display strings as sent by ESPN, e.g. 6' 8" and "230 lbs".
  height: string | null;
  weight: string | null;
  age: number | null;
  headshotUrl: string | null;
};
