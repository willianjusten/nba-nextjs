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
