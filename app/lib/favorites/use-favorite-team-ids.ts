"use client";

const NO_FAVORITE_TEAM_IDS: string[] = [];

// Stands in for the favorites store (#78), which will back this hook without changing its consumers.
export function useFavoriteTeamIds(): string[] {
  return NO_FAVORITE_TEAM_IDS;
}
