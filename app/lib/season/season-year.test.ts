import type { NbaDate } from "@/app/lib/domain/nba-date";
import { seasonStartYearOf } from "./season-year";

describe("seasonStartYearOf", () => {
  it.each<[string, number]>([
    ["2026-10-21", 2026],
    ["2026-12-31", 2026],
    ["2027-01-01", 2026],
    ["2027-06-15", 2026],
    // The offseason leads into the next season, whose games are the ones still ahead.
    ["2026-07-01", 2026],
    ["2026-08-15", 2026],
  ])("places %s in the season that starts in %i", (nbaDate, startYear) => {
    expect(seasonStartYearOf(nbaDate as NbaDate)).toBe(startYear);
  });
});
