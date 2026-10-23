import type { Game, Scoreboard } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import scheduledDay from "@/app/lib/espn/__fixtures__/scoreboard-scheduled-day.json";
import { mapGame } from "@/app/lib/espn/mappers";
import type { RawEvent } from "@/app/lib/espn/raw-types";
import {
  buildHomeView,
  type HomeView,
  type ScoreboardQueryState,
} from "./home-view";

const nbaDate = "2026-10-20" as NbaDate;
const now = new Date("2026-10-21T00:30:00Z");

const gamesOf = (fixture: { events: unknown[] }) =>
  fixture.events.map((event) => mapGame(event as RawEvent));

const [finalOrlando, finalSecond, finalLate] = gamesOf(finalDay);
const [liveGame, halftimeGame] = gamesOf(liveDay);
const [, scheduledLate] = gamesOf(scheduledDay);
const postponedGame: Game = { ...finalLate, status: { kind: "postponed" } };

function scoreboardWith(
  games: Game[],
  nextGameDate: NbaDate | null = null,
): Scoreboard {
  return { nbaDate, games, nextGameDate };
}

function viewFor(query: ScoreboardQueryState): HomeView {
  return buildHomeView({ nbaDate, query, now });
}

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

    expect(view.screen).toEqual({
      kind: "stale",
      cards: [{ game: liveGame }, { game: finalOrlando }],
      minutesAgo: 3,
    });
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
});
