import type { GameStatus } from "@/app/lib/domain/game";
import {
  millisecondsUntilPollingWindow,
  NO_POLLING,
  pollingInterval,
  type PollingContext,
} from "./polling-policy";

const now = new Date("2026-10-22T23:00:00Z");
const minutes = (count: number) => count * 60 * 1000;

function gameAt(
  status: GameStatus,
  minutesFromNow: number,
  extraMilliseconds = 0,
) {
  return {
    status,
    startTime: new Date(
      now.getTime() + minutes(minutesFromNow) + extraMilliseconds,
    ).toISOString(),
  };
}

const live: GameStatus = { kind: "live", period: 2, clock: "7:11" };
const halftime: GameStatus = { kind: "halftime", period: 2 };
const final: GameStatus = { kind: "final", period: 4 };
const scheduled: GameStatus = { kind: "scheduled" };
const postponed: GameStatus = { kind: "postponed" };

function intervalFor(
  games: ReturnType<typeof gameAt>[],
  options: { isTabVisible?: boolean; context?: PollingContext } = {},
) {
  return pollingInterval({
    games,
    now,
    isTabVisible: options.isTabVisible ?? true,
    context: options.context ?? "games-list",
  });
}

describe("pollingInterval", () => {
  it("polls the games list every 6 seconds while a game is live", () => {
    expect(intervalFor([gameAt(final, -180), gameAt(live, -60)])).toBe(6_000);
  });

  it("polls a game detail every 8 seconds while the game is live", () => {
    expect(intervalFor([gameAt(live, -60)], { context: "game-detail" })).toBe(
      8_000,
    );
  });

  it("keeps polling at halftime", () => {
    expect(intervalFor([gameAt(halftime, -75)])).toBe(6_000);
  });

  it("polls when a game starts exactly 10 minutes from now", () => {
    expect(intervalFor([gameAt(scheduled, 10)])).toBe(6_000);
  });

  it("does not poll when the next game starts just over 10 minutes from now", () => {
    expect(intervalFor([gameAt(scheduled, 10, 1)])).toBe(NO_POLLING);
  });

  it("keeps polling a scheduled game whose start time has passed", () => {
    expect(intervalFor([gameAt(scheduled, -5)])).toBe(6_000);
  });

  it("does not poll when every game is final", () => {
    expect(intervalFor([gameAt(final, -180), gameAt(final, -150)])).toBe(
      NO_POLLING,
    );
  });

  it("does not poll when the only remaining games are far away", () => {
    expect(intervalFor([gameAt(final, -180), gameAt(scheduled, 120)])).toBe(
      NO_POLLING,
    );
  });

  it("does not poll postponed games", () => {
    expect(intervalFor([gameAt(postponed, -5)])).toBe(NO_POLLING);
  });

  it("does not poll a day without games", () => {
    expect(intervalFor([])).toBe(NO_POLLING);
  });

  it.each<PollingContext>(["games-list", "game-detail"])(
    "does not poll the %s while the tab is hidden, even with a live game",
    (context) => {
      expect(
        intervalFor([gameAt(live, -60)], { isTabVisible: false, context }),
      ).toBe(NO_POLLING);
    },
  );
});

describe("millisecondsUntilPollingWindow", () => {
  it("returns the time until 10 minutes before the next scheduled game", () => {
    expect(
      millisecondsUntilPollingWindow(
        [gameAt(final, -180), gameAt(scheduled, 120), gameAt(scheduled, 45)],
        now,
      ),
    ).toBe(minutes(35));
  });

  it("returns null when the window is already open", () => {
    expect(
      millisecondsUntilPollingWindow([gameAt(scheduled, 5)], now),
    ).toBeNull();
  });

  it("returns null when no game is still to start", () => {
    expect(
      millisecondsUntilPollingWindow([gameAt(final, -180)], now),
    ).toBeNull();
  });
});
