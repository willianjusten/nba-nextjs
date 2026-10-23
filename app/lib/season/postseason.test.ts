import { mapGame } from "@/app/lib/espn/mappers";
import type { RawEvent } from "@/app/lib/espn/raw-types";
import regularSeasonDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import playInDay from "@/app/lib/espn/__fixtures__/scoreboard-play-in.json";
import playoffDay from "@/app/lib/espn/__fixtures__/scoreboard-playoff-game.json";
import noGamesDay from "@/app/lib/espn/__fixtures__/scoreboard-no-games.json";
import { isPostseason, isPostseasonForced } from "./postseason";

function gamesOf(fixture: unknown) {
  return (fixture as { events: RawEvent[] }).events.map(mapGame);
}

describe("isPostseason", () => {
  it("is false on a regular-season day", () => {
    expect(isPostseason(gamesOf(regularSeasonDay), false)).toBe(false);
  });

  it("is true on a play-in day", () => {
    expect(isPostseason(gamesOf(playInDay), false)).toBe(true);
  });

  it("is true on a playoff day", () => {
    expect(isPostseason(gamesOf(playoffDay), false)).toBe(true);
  });

  it("is false on a day without games", () => {
    expect(isPostseason(gamesOf(noGamesDay), false)).toBe(false);
  });

  it("is true on a regular-season day when the override forces it on", () => {
    expect(isPostseason(gamesOf(regularSeasonDay), true)).toBe(true);
  });

  it("is true on a day without games when the override forces it on", () => {
    expect(isPostseason(gamesOf(noGamesDay), true)).toBe(true);
  });

  it("stays true on a playoff day with the override on", () => {
    expect(isPostseason(gamesOf(playoffDay), true)).toBe(true);
  });
});

describe("isPostseasonForced", () => {
  it.each(["true", "1"])("forces the playoffs tab on for %j", (value) => {
    expect(isPostseasonForced(value)).toBe(true);
  });

  it.each([undefined, "", "false", "0", "yes"])(
    "leaves the rule alone for %j",
    (value) => {
      expect(isPostseasonForced(value)).toBe(false);
    },
  );
});
