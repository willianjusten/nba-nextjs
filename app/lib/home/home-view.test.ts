import type { Game, GameCounts, Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import internationalExhibition from "@/app/lib/espn/__fixtures__/scoreboard-international-exhibition.json";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import scheduledDay from "@/app/lib/espn/__fixtures__/scoreboard-scheduled-day.json";
import { mapGame } from "@/app/lib/espn/mappers";
import type { RawEvent } from "@/app/lib/espn/raw-types";
import {
  buildHomeView,
  dateRailRange,
  type HomeCard,
  type HomeView,
  type ScoreboardQueryState,
} from "./home-view";
import { contrastRatio, INK } from "./team-colors";

const nbaDate = "2026-10-20" as NbaDate;
const now = new Date("2026-10-21T00:30:00Z");
const today = "2026-10-22" as NbaDate;

const gamesOf = (fixture: { events: unknown[] }) =>
  fixture.events.map((event) => mapGame(event as RawEvent));

const [finalOrlando, finalSecond, finalLate] = gamesOf(finalDay);
const [liveGame, halftimeGame] = gamesOf(liveDay);
const [, scheduledLate] = gamesOf(scheduledDay);
const [exhibitionGame] = gamesOf(internationalExhibition);
const postponedGame: Game = { ...finalLate, status: { kind: "postponed" } };

function scoreboardWith(
  games: Game[],
  nextGameDate: NbaDate | null = null,
): Scoreboard {
  return { nbaDate, games, nextGameDate };
}

function viewFor(
  query: ScoreboardQueryState,
  timeZone: string | null = "America/New_York",
): HomeView {
  return buildHomeView({
    nbaDate,
    today,
    query,
    gameCounts: null,
    now,
    timeZone,
  });
}

function railFor(
  selectedDate: string,
  gameCounts: GameCounts | null = null,
  currentDate: string = today,
) {
  return buildHomeView({
    nbaDate: selectedDate as NbaDate,
    today: currentDate as NbaDate,
    query: { status: "loading" },
    gameCounts,
    now,
    timeZone: "America/New_York",
  }).dateRail;
}

function cardFor(game: Game, timeZone?: string | null): HomeCard {
  const view = viewFor(
    { status: "success", scoreboard: scoreboardWith([game]) },
    timeZone,
  );
  if (view.screen.kind !== "games") throw new Error("Expected a games screen");
  return view.screen.cards[0];
}

const withStatus = (game: Game, status: Game["status"]): Game => ({
  ...game,
  status,
});

const cardIds = (view: HomeView) =>
  view.screen.kind === "games" || view.screen.kind === "stale"
    ? view.screen.cards.map((card) => card.game.id)
    : [];

describe("buildHomeView", () => {
  it("headlines the selected NBA date in full, split, and compact forms", () => {
    expect(viewFor({ status: "loading" }).heading).toEqual({
      label: "Tuesday, October 20",
      weekday: "Tuesday",
      monthDay: "October 20",
      compact: "Tue, Oct 20",
    });
  });

  it("orders live games first, then scheduled, then final, then postponed", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith([
        postponedGame,
        finalOrlando,
        scheduledLate,
        finalSecond,
        liveGame,
      ]),
    });

    expect(cardIds(view)).toEqual([
      liveGame.id,
      scheduledLate.id,
      finalOrlando.id,
      finalSecond.id,
      postponedGame.id,
    ]);
  });

  it("orders games within the same status by tip-off", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith([finalLate, finalOrlando]),
    });

    expect(cardIds(view)).toEqual([finalOrlando.id, finalLate.id]);
  });

  it("treats halftime as live", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith([finalOrlando, halftimeGame]),
    });

    expect(cardIds(view)).toEqual([halftimeGame.id, finalOrlando.id]);
    expect(view.summary).toEqual({ total: 2, live: 1, final: 1 });
  });

  it("counts total, live, and final games, leaving out scheduled and postponed ones from both", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith([
        liveGame,
        halftimeGame,
        scheduledLate,
        finalOrlando,
        postponedGame,
      ]),
    });

    expect(view.summary).toEqual({ total: 5, live: 2, final: 1 });
  });

  it("shows the games once the scoreboard loads", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith(gamesOf(finalDay)),
    });

    expect(view.screen.kind).toBe("games");
    expect(view.summary).toEqual({ total: 3, live: 0, final: 3 });
  });

  it("shows a loading state without a summary while the scoreboard is pending", () => {
    const view = viewFor({ status: "loading" });

    expect(view.screen).toEqual({ kind: "loading" });
    expect(view.summary).toBeNull();
  });

  it("shows an error, never an empty day or a summary, when the request fails", () => {
    const view = viewFor({ status: "error" });

    expect(view.screen).toEqual({ kind: "error" });
    expect(view.summary).toBeNull();
  });

  it("keeps the last games with how many minutes old they are when a refetch fails", () => {
    const view = viewFor({
      status: "stale",
      scoreboard: scoreboardWith([finalOrlando, liveGame]),
      updatedAt: now.getTime() - 3 * 60_000,
    });

    expect(view.screen).toMatchObject({ kind: "stale", minutesAgo: 3 });
    expect(cardIds(view)).toEqual([liveGame.id, finalOrlando.id]);
    expect(view.summary).toEqual({ total: 2, live: 1, final: 1 });
  });

  it("reports stale data as at least a minute old", () => {
    const view = viewFor({
      status: "stale",
      scoreboard: scoreboardWith([liveGame]),
      updatedAt: now.getTime() - 5_000,
    });

    expect(view.screen).toMatchObject({ kind: "stale", minutesAgo: 1 });
  });

  it("shows an empty day with the next game date and no summary", () => {
    const view = viewFor({
      status: "success",
      scoreboard: scoreboardWith([], "2026-10-23" as NbaDate),
    });

    expect(view.screen).toEqual({
      kind: "empty",
      nextGameDate: "2026-10-23",
    });
    expect(view.summary).toBeNull();
  });

  it("keeps showing an empty day when a refetch of it fails", () => {
    const view = viewFor({
      status: "stale",
      scoreboard: scoreboardWith([]),
      updatedAt: now.getTime(),
    });

    expect(view.screen).toEqual({ kind: "empty", nextGameDate: null });
  });

  describe("date rail", () => {
    const railDates = (rail: ReturnType<typeof railFor>) =>
      rail.days.map((day) => day.nbaDate);

    it("shows 7 days centered on the selected date", () => {
      expect(railDates(railFor("2026-10-20"))).toEqual([
        "2026-10-17",
        "2026-10-18",
        "2026-10-19",
        "2026-10-20",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
      ]);
    });

    it("selects only the middle day", () => {
      const selectedDays = railFor("2026-10-20").days.map(
        (day) => day.isSelected,
      );

      expect(selectedDays).toEqual([
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ]);
    });

    it("labels each day with its short weekday, day number, and full date", () => {
      expect(railFor("2026-10-20").days[2]).toMatchObject({
        weekday: "MON",
        dayNumber: "19",
        label: "Monday, October 19",
      });
    });

    it("links today to the home page and every other day to its games page", () => {
      const hrefs = railFor("2026-10-20").days.map((day) => day.href);

      expect(hrefs).toEqual([
        "/games/2026-10-17",
        "/games/2026-10-18",
        "/games/2026-10-19",
        "/games/2026-10-20",
        "/games/2026-10-21",
        "/",
        "/games/2026-10-23",
      ]);
    });

    it("moves a week back and forward from the selected date", () => {
      const rail = railFor("2026-10-20");

      expect(rail.previousWeekHref).toBe("/games/2026-10-13");
      expect(rail.nextWeekHref).toBe("/games/2026-10-27");
    });

    it("sends a week move that lands on today to the home page", () => {
      expect(railFor("2026-10-15").nextWeekHref).toBe("/");
      expect(railFor("2026-10-29").previousWeekHref).toBe("/");
    });

    it("shows each day's game count once the counts load", () => {
      const rail = railFor("2026-10-20", {
        "2026-10-19": 0,
        "2026-10-20": 3,
        "2026-10-21": 1,
      } as GameCounts);
      const [, , monday, tuesday, wednesday] = rail.days;

      expect(monday).toMatchObject({
        gameCount: 0,
        countLabel: "No games",
        label: "Monday, October 19, No games",
      });
      expect(tuesday).toMatchObject({
        gameCount: 3,
        countLabel: "3 games",
        label: "Tuesday, October 20, 3 games",
      });
      expect(wednesday).toMatchObject({ gameCount: 1, countLabel: "1 game" });
    });

    it('shows no count, never "No games", while the counts are pending or failed', () => {
      const [firstDay] = railFor("2026-10-20", null).days;

      expect(firstDay).toMatchObject({
        gameCount: null,
        countLabel: null,
        label: "Saturday, October 17",
      });
    });

    it("crosses a month boundary", () => {
      const rail = railFor("2026-11-01");

      expect(railDates(rail)).toEqual([
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01",
        "2026-11-02",
        "2026-11-03",
        "2026-11-04",
      ]);
      expect(rail.previousWeekHref).toBe("/games/2026-10-25");
    });

    it("crosses a year boundary", () => {
      const rail = railFor("2026-12-31");

      expect(railDates(rail)).toEqual([
        "2026-12-28",
        "2026-12-29",
        "2026-12-30",
        "2026-12-31",
        "2027-01-01",
        "2027-01-02",
        "2027-01-03",
      ]);
      expect(rail.days[4]).toMatchObject({ weekday: "FRI", dayNumber: "1" });
      expect(rail.nextWeekHref).toBe("/games/2027-01-07");
    });

    it("keeps whole days across the daylight saving change", () => {
      expect(railDates(railFor("2026-11-01")).at(-1)).toBe("2026-11-04");
      expect(railDates(railFor("2027-03-14")).at(0)).toBe("2027-03-11");
    });

    it("exposes the range whose game counts the rail needs", () => {
      expect(dateRailRange("2026-12-31" as NbaDate)).toEqual({
        firstDate: "2026-12-28",
        lastDate: "2027-01-03",
      });
    });
  });

  describe("cards", () => {
    it.each<[string, Game["status"], string]>([
      [
        "live in regulation",
        { kind: "live", period: 3, clock: "4:12" },
        "Q3 4:12",
      ],
      [
        "live in overtime",
        { kind: "live", period: 5, clock: "1:05" },
        "OT 1:05",
      ],
      [
        "live in double overtime",
        { kind: "live", period: 6, clock: "0:42" },
        "2OT 0:42",
      ],
      ["at halftime", { kind: "halftime", period: 2 }, "Halftime"],
      ["final", { kind: "final", period: 4 }, "Final"],
      ["final after overtime", { kind: "final", period: 5 }, "Final/OT"],
      ["postponed", { kind: "postponed" }, "PPD"],
      ["canceled", { kind: "canceled" }, "PPD"],
    ])("labels a game %s", (_case, status, expectedLabel) => {
      expect(cardFor(withStatus(liveGame, status)).statusLabel).toBe(
        expectedLabel,
      );
    });

    it.each<[string, string]>([
      ["America/New_York", "9:30 PM"],
      ["America/Los_Angeles", "6:30 PM"],
      ["America/Sao_Paulo", "10:30 PM"],
    ])(
      "labels a scheduled game with its tip-off in %s",
      (timeZone, expectedLabel) => {
        expect(cardFor(scheduledLate, timeZone).statusLabel).toBe(
          expectedLabel,
        );
      },
    );

    it("adds the weekday when a late ET tip-off falls on the next local day", () => {
      expect(cardFor(scheduledLate, "Europe/London").statusLabel).toBe(
        "Fri 2:30 AM",
      );
      expect(cardFor(scheduledLate, "Asia/Tokyo").statusLabel).toBe(
        "Fri 10:30 AM",
      );
    });

    it("leaves the tip-off empty until the browser timezone is known", () => {
      expect(cardFor(scheduledLate, null).statusLabel).toBeNull();
    });

    it("shows the national channel", () => {
      expect(cardFor(liveGame).channelLabel).toBe("ESPN");
    });

    it("lists multiple channels national first", () => {
      const game: Game = {
        ...liveGame,
        broadcasts: [
          { name: "ESPN", market: "national" },
          { name: "NBA League Pass", market: "home" },
        ],
      };

      expect(cardFor(game).channelLabel).toBe("ESPN · NBA League Pass");
    });

    it("falls back to NBA League Pass when no supported channel carries the game", () => {
      expect(cardFor(exhibitionGame).channelLabel).toBe("NBA League Pass");
    });

    it.each<[string, Game, string]>([
      [
        "live games",
        withStatus(liveGame, { kind: "live", period: 3, clock: "4:12" }),
        "Q3 · 4:12 · ESPN",
      ],
      ["halftime", halftimeGame, "Halftime · ESPN"],
      ["finals", finalOrlando, "NBA League Pass"],
      ["scheduled games", scheduledLate, "ESPN"],
      ["postponed games", postponedGame, "ESPN"],
    ])("builds the meta line of %s", (_case, game, expectedMeta) => {
      expect(cardFor(game).metaLabel).toBe(expectedMeta);
    });

    it("gives the venue its own line on games that have not been played", () => {
      expect(cardFor(scheduledLate).venueLabel).toBe("Paycom Center");
      expect(cardFor(postponedGame).venueLabel).toBe("Kaseya Center");
    });

    it("leaves the venue out once the game has started or when ESPN has none", () => {
      expect(cardFor(liveGame).venueLabel).toBeNull();
      expect(cardFor(finalOrlando).venueLabel).toBeNull();
      expect(cardFor({ ...scheduledLate, venue: null }).venueLabel).toBeNull();
    });

    it("marks the leading team once the game has a score", () => {
      expect(cardFor(liveGame).leadingSide).toBe("home");
      expect(cardFor(finalOrlando).leadingSide).toBe("away");
    });

    it("marks no leader when the score is tied or the game has not started", () => {
      const tiedGame: Game = {
        ...liveGame,
        away: { ...liveGame.away, score: liveGame.home.score },
      };

      expect(cardFor(tiedGame).leadingSide).toBeNull();
      expect(cardFor(scheduledLate).leadingSide).toBeNull();
      expect(cardFor(postponedGame).leadingSide).toBeNull();
    });

    describe("win probability", () => {
      const withProbability = (game: Game): Game => ({
        ...game,
        homeWinProbability: 0.684,
      });

      it("splits the bar between both teams in whole percents", () => {
        expect(cardFor(withProbability(liveGame)).winProbability).toEqual({
          away: { abbreviation: "CLE", percent: 32 },
          home: { abbreviation: "PHI", percent: 68 },
        });
      });

      it("shows the bar at halftime", () => {
        expect(
          cardFor(withProbability(halftimeGame)).winProbability,
        ).not.toBeNull();
      });

      it("hides the bar when ESPN sends no probability", () => {
        expect(cardFor(liveGame).winProbability).toBeNull();
      });

      it("hides the bar once the game is over", () => {
        expect(
          cardFor(withProbability(finalOrlando)).winProbability,
        ).toBeNull();
      });
    });

    describe("top scorer", () => {
      it("names the top scorer with ESPN's stat line", () => {
        const game: Game = { ...liveGame, topScorer: finalOrlando.topScorer };

        expect(cardFor(game).topScorerLabel).toBe(
          "P. Banchero · 35 PTS 7 REB 10 AST",
        );
      });

      it("falls back to points when ESPN has no stat line for the top scorer", () => {
        const game: Game = {
          ...liveGame,
          topScorer: { ...finalOrlando.topScorer!, statLine: null },
        };

        expect(cardFor(game).topScorerLabel).toBe("P. Banchero · 35 PTS");
      });

      it("hides the top scorer when ESPN sends no leaders", () => {
        expect(
          cardFor({ ...liveGame, topScorer: null }).topScorerLabel,
        ).toBeNull();
      });

      it("shows the top scorer only while the game is live", () => {
        expect(cardFor(finalOrlando).topScorerLabel).toBeNull();
      });
    });

    it("offers highlights only for finished games", () => {
      expect(cardFor(finalOrlando).showHighlights).toBe(true);
      expect(cardFor(liveGame).showHighlights).toBe(false);
      expect(cardFor(scheduledLate).showHighlights).toBe(false);
      expect(cardFor(postponedGame).showHighlights).toBe(false);
    });

    describe("team colors", () => {
      it("keeps a primary color that reaches 3:1 against Ink", () => {
        // OKC blue is readable on Ink as is.
        expect(cardFor(scheduledLate).teamColors.home).toBe("#007ac1");
      });

      it("switches to the alternate when the primary is too dark", () => {
        // DEN navy fails on Ink, so its gold alternate is used.
        expect(cardFor(scheduledLate).teamColors.away).toBe("#fec524");
      });

      it("lightens the primary when neither color is readable", () => {
        // MIA red and its black alternate both fail on Ink.
        const { home } = cardFor(finalLate).teamColors;

        expect(home).not.toBe("#98002e");
        expect(home).not.toBe("#000000");
        expect(contrastRatio(home, INK)).toBeGreaterThanOrEqual(3);
      });

      it("switches the away team when both teams end up looking alike", () => {
        const game: Game = {
          ...scheduledLate,
          home: {
            ...scheduledLate.home,
            team: {
              ...scheduledLate.home.team,
              color: "552583",
              alternateColor: "fdb927",
            },
          },
        };
        const { home, away } = cardFor(game).teamColors;

        expect(home).toBe("#fdb927");
        expect(away).not.toBe("#fec524");
        expect(contrastRatio(away, INK)).toBeGreaterThanOrEqual(3);
      });

      it("uses a neutral color for a team without colors", () => {
        const { away } = cardFor(exhibitionGame).teamColors;

        expect(contrastRatio(away, INK)).toBeGreaterThanOrEqual(3);
      });
    });
  });
});
