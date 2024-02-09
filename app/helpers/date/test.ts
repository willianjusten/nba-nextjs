import { getLeagueYear } from ".";

describe("getLeagueYear", () => {
  it("should return the same year when it's end of the season", () => {
    const date = new Date("2024-10-02");
    expect(getLeagueYear(date)).toBe(2024);
  });

  it("should return the previous year when it's the begining of the season", () => {
    const date = new Date("2024-02-08");
    expect(getLeagueYear(date)).toBe(2023);
  });

  describe("COVID_YEAR", () => {
    it("should return the same year when it's end of the season", () => {
      const date = new Date("2020-11-02");
      expect(getLeagueYear(date)).toBe(2020);
    });

    it("should return the previous year when it's the begining of the season", () => {
      const date = new Date("2020-02-08");
      expect(getLeagueYear(date)).toBe(2019);
    });
  });
});
