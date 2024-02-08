import { AWAY_TEAM, HOME_TEAM } from "@/app/constants";
import { getWinner } from ".";

describe("getWinner", () => {
  it("should return null if the same score", () => {
    const awayTeam = { score: 0 };
    const homeTeam = { score: 0 };

    const result = getWinner(awayTeam, homeTeam);
    expect(result).toBe(null);
  });

  it("should return the home team as the winner", () => {
    const awayTeam = { score: 0 };
    const homeTeam = { score: 1 };

    const result = getWinner(awayTeam, homeTeam);
    expect(result).toBe(HOME_TEAM);
  });

  it("should return the away team as the winner", () => {
    const awayTeam = { score: 3 };
    const homeTeam = { score: 1 };

    const result = getWinner(awayTeam, homeTeam);
    expect(result).toBe(AWAY_TEAM);
  });
});
