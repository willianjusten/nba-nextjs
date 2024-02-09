import { AWAY_TEAM, HOME_TEAM } from "@/app/constants";
import { getWinner } from ".";

describe("getWinner", () => {
  it("should return null if the scores are the same", () => {
    const awayTeam = { score: 0 };
    const homeTeam = { score: 0 };
    expect(getWinner({ homeTeam, awayTeam })).toBe(null);
  });

  it("should return AWAY_TEAM as winner", () => {
    const awayTeam = { score: 10 };
    const homeTeam = { score: 2 };
    expect(getWinner({ homeTeam, awayTeam })).toBe(AWAY_TEAM);
  });

  it("should return HOME_TEAM as winner", () => {
    const awayTeam = { score: 1 };
    const homeTeam = { score: 25 };
    expect(getWinner({ homeTeam, awayTeam })).toBe(HOME_TEAM);
  });
});
