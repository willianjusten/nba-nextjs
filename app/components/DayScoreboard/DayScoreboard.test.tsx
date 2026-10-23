import { QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import headerWeek from "@/app/lib/espn/__fixtures__/scoreboard-header-week.json";
import noGames from "@/app/lib/espn/__fixtures__/scoreboard-no-games.json";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
import { strings } from "@/app/lib/strings";
import DayScoreboard from ".";

const nbaDate = "2026-10-21" as NbaDate;
const today = "2026-10-23" as NbaDate;
const fetchMock = vi.fn();
const gameCountsFetchMock = vi.fn();
const routerPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
}));

function renderDayScoreboard(currentDate: NbaDate = today) {
  const queryClient = makeQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false } });

  return render(
    <QueryClientProvider client={queryClient}>
      <DayScoreboard nbaDate={nbaDate} today={currentDate} />
    </QueryClientProvider>,
  );
}

function returnToTab() {
  act(() => {
    window.dispatchEvent(new Event("visibilitychange"));
  });
}

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

function dateRail() {
  return screen.getByRole("group", { name: strings.dateRail.label });
}

beforeEach(() => {
  fetchMock.mockReset();
  routerPush.mockReset();
  gameCountsFetchMock.mockReset();
  gameCountsFetchMock.mockImplementation(async () => jsonResponse(headerWeek));
  // The rail's game counts come from their own endpoint, so each test scripts the scoreboard alone.
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) =>
    url.includes("/scoreboard/header")
      ? gameCountsFetchMock(url, init)
      : fetchMock(url, init),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DayScoreboard", () => {
  it("shows a loading state while the scoreboard is fetching", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));

    renderDayScoreboard();

    expect(screen.getByRole("status").textContent).toContain(
      strings.games.loading,
    );
  });

  it("shows the games once the scoreboard loads", async () => {
    fetchMock.mockResolvedValue(jsonResponse(finalDay));

    renderDayScoreboard();

    expect(await screen.findByText("Magic")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("headlines the date with a summary of its live and final games", async () => {
    fetchMock.mockResolvedValue(jsonResponse(liveDay));

    renderDayScoreboard();

    expect(
      screen.getByRole("heading", { name: "Wednesday, October 21" }),
    ).toBeDefined();
    expect(await screen.findByText("2 games · 2 live")).toBeDefined();
  });

  it("shows an error with a retry button that reloads the games", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));

    renderDayScoreboard();

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert.textContent).toContain(strings.games.error);
    expect(errorAlert.textContent).toContain(strings.games.errorDetail);
    expect(screen.queryByText(/No games on/)).toBeNull();
    const dateHeading = screen.getByRole("heading").closest("header")!;
    expect(within(dateHeading).queryByText(/\d+ games?/)).toBeNull();
    expect(screen.queryByText("Magic")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(finalDay));
    fireEvent.click(screen.getByRole("button", { name: strings.games.retry }));

    expect(await screen.findByText("Magic")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows a specific empty state on a day without games", async () => {
    fetchMock.mockResolvedValue(jsonResponse(noGames));

    renderDayScoreboard();

    expect(
      await screen.findByText(strings.games.empty("Wed, Oct 21")),
    ).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("links a day without games to the next game day", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        ...noGames,
        leagues: [{ calendar: ["2026-10-20T07:00Z", "2026-10-23T07:00Z"] }],
      }),
    );

    renderDayScoreboard();

    const nextGamesLink = await screen.findByRole("link", {
      name: strings.games.nextGames("Fri, Oct 23"),
    });
    expect(nextGamesLink.getAttribute("href")).toBe("/games/2026-10-23");
  });

  it("offers no next games link once the season has no game days left", async () => {
    fetchMock.mockResolvedValue(jsonResponse(noGames));

    renderDayScoreboard();

    await screen.findByText(strings.games.empty("Wed, Oct 21"));
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("keeps the last scores with a stale notice when a refetch fails, and clears it after a successful one", async () => {
    vi.useFakeTimers({
      toFake: ["Date"],
      now: new Date("2026-10-22T23:45:00Z"),
    });
    fetchMock.mockResolvedValueOnce(jsonResponse(liveDay));
    renderDayScoreboard();
    expect(await screen.findByText("76ers")).toBeDefined();

    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));
    returnToTab();

    const staleNotice = await screen.findByText(strings.games.stale(1));
    expect(staleNotice.closest("[role=status]")?.textContent).toContain(
      strings.games.retryingAutomatically,
    );
    expect(screen.getByText("76ers")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(liveDay));
    returnToTab();

    await vi.waitFor(() =>
      expect(screen.queryByText(strings.games.stale(1))).toBeNull(),
    );
    expect(screen.getByText("76ers")).toBeDefined();
    vi.useRealTimers();
  });

  describe("date rail", () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue(jsonResponse(finalDay));
    });

    it("shows a week of days centered on the date, with the date pressed", () => {
      renderDayScoreboard();

      const dayButtons = within(dateRail()).getAllByRole("button");
      expect(
        dayButtons.map((button) => button.getAttribute("aria-label")),
      ).toEqual([
        "Sunday, October 18",
        "Monday, October 19",
        "Tuesday, October 20",
        "Wednesday, October 21",
        "Thursday, October 22",
        "Friday, October 23",
        "Saturday, October 24",
      ]);
      expect(
        dayButtons.map((button) => button.getAttribute("aria-pressed")),
      ).toEqual(["false", "false", "false", "true", "false", "false", "false"]);
      expect(dayButtons[3].textContent).toContain("WED");
      expect(dayButtons[3].textContent).toContain("21");
    });

    it("shows each day's game count, and marks days without games, once the counts load", async () => {
      renderDayScoreboard();

      expect(
        await within(dateRail()).findByRole("button", {
          name: "Wednesday, October 21, 11 games",
        }),
      ).toBeDefined();
      expect(
        within(dateRail()).getByRole("button", {
          name: "Sunday, October 18, No games",
        }).textContent,
      ).toContain("No games");
      expect(gameCountsFetchMock).toHaveBeenCalledOnce();
      expect(gameCountsFetchMock.mock.calls[0][0]).toContain(
        "dates=20261018-20261024",
      );
    });

    it("shows the days without counts when the counts fail to load", async () => {
      gameCountsFetchMock.mockImplementation(
        async () => new Response("", { status: 503 }),
      );

      renderDayScoreboard();

      await screen.findByText("Magic");
      expect(within(dateRail()).queryByText("No games")).toBeNull();
      expect(within(dateRail()).getAllByRole("button")).toHaveLength(7);
    });

    it("navigates client-side to the chosen day", () => {
      renderDayScoreboard();

      fireEvent.click(
        within(dateRail()).getByRole("button", { name: /^Thursday/ }),
      );

      expect(routerPush).toHaveBeenCalledWith("/games/2026-10-22");
    });

    it("navigates to the home page when today is chosen", () => {
      renderDayScoreboard("2026-10-22" as NbaDate);

      fireEvent.click(
        within(dateRail()).getByRole("button", { name: /^Thursday/ }),
      );

      expect(routerPush).toHaveBeenCalledWith("/");
    });

    it("moves a week back and forward with the arrows", () => {
      renderDayScoreboard();

      fireEvent.click(
        screen.getByRole("button", { name: strings.dateRail.previousWeek }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: strings.dateRail.nextWeek }),
      );

      expect(routerPush.mock.calls).toEqual([
        ["/games/2026-10-14"],
        ["/games/2026-10-28"],
      ]);
    });
  });
});
