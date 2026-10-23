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
const scrollBy = vi.fn();

// Next.js keeps usePathname in sync with native history calls; this stand-in does the same over happy-dom's history.
vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");
  const pathnameListeners = new Set<() => void>();
  const notifyPathnameListeners = () =>
    pathnameListeners.forEach((listener) => listener());

  for (const method of ["pushState", "replaceState"] as const) {
    const originalMethod = window.history[method].bind(window.history);
    window.history[method] = (...args) => {
      originalMethod(...args);
      notifyPathnameListeners();
    };
  }
  window.addEventListener("popstate", notifyPathnameListeners);

  const subscribe = (listener: () => void) => {
    pathnameListeners.add(listener);
    return () => pathnameListeners.delete(listener);
  };
  return {
    usePathname: () =>
      useSyncExternalStore(subscribe, () => window.location.pathname),
  };
});

function renderDayScoreboard(currentDate: NbaDate = today) {
  const queryClient = makeQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false } });

  return render(
    <QueryClientProvider client={queryClient}>
      <DayScoreboard initialDate={nbaDate} today={currentDate} />
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
  window.history.replaceState(null, "", `/games/${nbaDate}`);
  scrollBy.mockReset();
  HTMLElement.prototype.scrollBy = scrollBy;
  HTMLElement.prototype.scrollTo = vi.fn();
  fetchMock.mockReset();
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

  it("links a day without games to the next game day on the season calendar", async () => {
    // The day's scoreboard and its season calendar are separate requests, each needing its own response.
    fetchMock.mockImplementation(async () =>
      jsonResponse({
        ...noGames,
        leagues: [{ calendar: ["2026-10-20T07:00Z", "2026-10-24T07:00Z"] }],
      }),
    );

    renderDayScoreboard();

    const nextGamesLink = await screen.findByRole("link", {
      name: strings.games.nextGames("Sat, Oct 24"),
    });
    expect(nextGamesLink.getAttribute("href")).toBe("/games/2026-10-24");
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

  describe("date picker", () => {
    const seasonDay = {
      ...finalDay,
      leagues: [
        {
          calendar: [
            "2026-10-21T07:00Z",
            "2026-11-03T07:00Z",
            "2026-11-20T07:00Z",
          ],
        },
      ],
    };

    beforeEach(() => {
      fetchMock.mockImplementation(async () => jsonResponse(seasonDay));
    });

    async function openCalendar(name: string = strings.calendar.pickDateLabel) {
      fireEvent.click(screen.getByRole("button", { name }));
      return screen.findByRole("dialog", {
        name: strings.calendar.pickDateLabel,
      });
    }

    it("offers the calendar in the rail row and in the header", () => {
      renderDayScoreboard();

      const pickDateButton = within(dateRail().parentElement!).getByRole(
        "button",
        { name: strings.calendar.pickDateLabel },
      );
      expect(pickDateButton.textContent).toContain(strings.calendar.pickDate);
      const dateHeading = screen.getByRole("heading").closest("header")!;
      expect(
        within(dateHeading).getByRole("button", {
          name: strings.calendar.openCalendar,
        }),
      ).toBeDefined();
    });

    it("opens on the selected month, marking the season's game days", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");

      const calendar = await openCalendar(strings.calendar.openCalendar);

      expect(within(calendar).getByText("October 2026")).toBeDefined();
      const selectedDay = within(calendar).getByRole("button", {
        name: "Wednesday, October 21, Game day",
      });
      expect(selectedDay.getAttribute("aria-pressed")).toBe("true");
      expect(
        within(calendar).getByRole("button", { name: "Thursday, October 22" }),
      ).toBeDefined();
    });

    it("moves between months", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");
      const calendar = await openCalendar();

      fireEvent.click(
        within(calendar).getByRole("button", {
          name: strings.calendar.nextMonth,
        }),
      );

      expect(within(calendar).getByText("November 2026")).toBeDefined();
      expect(
        within(calendar).getByRole("button", {
          name: "Tuesday, November 3, Game day",
        }),
      ).toBeDefined();
    });

    it("recenters the rail on a picked date outside it, loading that range's game counts", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");
      const calendar = await openCalendar();
      fireEvent.click(
        within(calendar).getByRole("button", {
          name: strings.calendar.nextMonth,
        }),
      );

      fireEvent.click(
        within(calendar).getByRole("button", { name: /^Friday, November 20/ }),
      );

      const railButtons = within(dateRail()).getAllByRole("button");
      expect(railButtons).toHaveLength(15);
      expect(railButtons[0].getAttribute("aria-label")).toMatch(
        /^Friday, November 13/,
      );
      expect(railButtons[7].getAttribute("aria-pressed")).toBe("true");
      expect(railButtons[7].getAttribute("aria-label")).toMatch(
        /^Friday, November 20/,
      );
      await vi.waitFor(() =>
        expect(gameCountsFetchMock.mock.calls.at(-1)?.[0]).toContain(
          "dates=20261113-20261127",
        ),
      );
    });

    it("keeps the rail in place when the picked date is already on it", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");
      const calendar = await openCalendar();

      fireEvent.click(
        within(calendar).getByRole("button", { name: /^Sunday, October 25/ }),
      );

      const railButtons = within(dateRail()).getAllByRole("button");
      expect(railButtons[0].getAttribute("aria-label")).toMatch(
        /^Wednesday, October 14/,
      );
      expect(
        within(dateRail())
          .getByRole("button", { name: /^Sunday, October 25/ })
          .getAttribute("aria-pressed"),
      ).toBe("true");
    });

    it("keeps marking each season's game days after an offseason day is picked", async () => {
      // ESPN answers an offseason day with the season that just ended, so each season is read from its own first day.
      const seasonCalendars: Record<string, string[]> = {
        "dates=20251001": ["2026-06-10T07:00Z"],
        "dates=20261001": ["2026-10-21T07:00Z", "2026-11-03T07:00Z"],
      };
      fetchMock.mockImplementation(async (url: string) => {
        const seasonQuery = Object.keys(seasonCalendars).find((query) =>
          url.includes(query),
        );
        return jsonResponse(
          seasonQuery
            ? {
                ...noGames,
                leagues: [{ calendar: seasonCalendars[seasonQuery] }],
              }
            : { ...noGames, leagues: [{ calendar: ["2026-06-10T07:00Z"] }] },
        );
      });
      renderDayScoreboard();
      const previousMonthName = { name: strings.calendar.previousMonth };
      const nextMonthName = { name: strings.calendar.nextMonth };

      let calendar = await openCalendar();
      fireEvent.click(within(calendar).getByRole("button", previousMonthName));
      fireEvent.click(within(calendar).getByRole("button", previousMonthName));
      fireEvent.click(
        within(calendar).getByRole("button", { name: /^Saturday, August 15/ }),
      );
      expect(window.location.pathname).toBe("/games/2026-08-15");
      expect(
        await screen.findByRole("link", {
          name: strings.games.nextGames("Wed, Oct 21"),
        }),
      ).toBeDefined();

      calendar = await openCalendar();
      fireEvent.click(within(calendar).getByRole("button", nextMonthName));
      fireEvent.click(within(calendar).getByRole("button", nextMonthName));

      expect(within(calendar).getByText("October 2026")).toBeDefined();
      expect(
        await within(calendar).findByRole("button", {
          name: "Wednesday, October 21, Game day",
        }),
      ).toBeDefined();
    });

    it("switches to the chosen date at once and closes", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");
      const calendar = await openCalendar();
      fireEvent.click(
        within(calendar).getByRole("button", {
          name: strings.calendar.nextMonth,
        }),
      );

      fireEvent.click(
        within(calendar).getByRole("button", {
          name: "Friday, November 20, Game day",
        }),
      );

      expect(window.location.pathname).toBe("/games/2026-11-20");
      expect(
        screen.getByRole("heading", { name: "Friday, November 20" }),
      ).toBeDefined();
      await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });
  });

  describe("date rail", () => {
    const dayButtons = () => within(dateRail()).getAllByRole("button");

    beforeEach(() => {
      fetchMock.mockImplementation(async (url: string) =>
        jsonResponse(url.includes("dates=20261022") ? liveDay : finalDay),
      );
    });

    it("shows 15 days centered on the page's date, with that date pressed", () => {
      renderDayScoreboard();

      const buttons = dayButtons();
      expect(buttons).toHaveLength(15);
      expect(buttons[0].getAttribute("aria-label")).toBe(
        "Wednesday, October 14",
      );
      expect(buttons[14].getAttribute("aria-label")).toBe(
        "Wednesday, October 28",
      );
      expect(buttons[7].getAttribute("aria-pressed")).toBe("true");
      expect(buttons[7].textContent).toContain("WED");
      expect(buttons[7].textContent).toContain("21");
      expect(
        buttons.filter(
          (button) => button.getAttribute("aria-pressed") === "true",
        ),
      ).toHaveLength(1);
    });

    it("shows each day's game count, and marks days without games, from one request for the whole rail", async () => {
      renderDayScoreboard();

      expect(
        await within(dateRail()).findByRole("button", {
          name: "Wednesday, October 21, 11 games",
        }),
      ).toBeDefined();
      expect(
        within(dateRail()).getByRole("button", {
          name: "Wednesday, October 14, No games",
        }).textContent,
      ).toContain("No games");
      expect(gameCountsFetchMock).toHaveBeenCalledOnce();
      expect(gameCountsFetchMock.mock.calls[0][0]).toContain(
        "dates=20261014-20261028",
      );
    });

    it("shows the days without counts when the counts fail to load", async () => {
      gameCountsFetchMock.mockImplementation(
        async () => new Response("", { status: 503 }),
      );

      renderDayScoreboard();

      await screen.findByText("Magic");
      expect(within(dateRail()).queryByText("No games")).toBeNull();
      expect(dayButtons()).toHaveLength(15);
    });

    it("switches to the chosen day's games at once, updating the URL without a server navigation", async () => {
      renderDayScoreboard();
      await screen.findByText("Magic");

      fireEvent.click(
        within(dateRail()).getByRole("button", {
          name: /^Thursday, October 22/,
        }),
      );

      expect(window.location.pathname).toBe("/games/2026-10-22");
      expect(
        screen.getByRole("heading", { name: "Thursday, October 22" }),
      ).toBeDefined();
      expect(
        within(dateRail())
          .getByRole("button", { name: /^Thursday, October 22/ })
          .getAttribute("aria-pressed"),
      ).toBe("true");
      expect(await screen.findByText("76ers")).toBeDefined();
      expect(dayButtons()[0].getAttribute("aria-label")).toMatch(
        /^Wednesday, October 14/,
      );
    });

    it("adds no history entry when the selected day is chosen again", () => {
      renderDayScoreboard();
      const historyLength = window.history.length;

      fireEvent.click(
        within(dateRail()).getByRole("button", {
          name: /^Wednesday, October 21/,
        }),
      );

      expect(window.history.length).toBe(historyLength);
      expect(window.location.pathname).toBe(`/games/${nbaDate}`);
    });

    it("puts today at the home page URL", () => {
      renderDayScoreboard();

      fireEvent.click(
        within(dateRail()).getByRole("button", { name: /^Friday, October 23/ }),
      );

      expect(window.location.pathname).toBe("/");
      expect(
        screen.getByRole("heading", { name: "Friday, October 23" }),
      ).toBeDefined();
    });

    it("follows the URL when the browser goes back", () => {
      renderDayScoreboard();
      fireEvent.click(
        within(dateRail()).getByRole("button", {
          name: /^Thursday, October 22/,
        }),
      );

      act(() => {
        window.history.replaceState(null, "", `/games/${nbaDate}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      expect(
        screen.getByRole("heading", { name: "Wednesday, October 21" }),
      ).toBeDefined();
    });

    it("slides the rail one day back and forward with the arrows, keeping the selected day", () => {
      renderDayScoreboard();

      fireEvent.click(
        screen.getByRole("button", { name: strings.dateRail.previousDays }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: strings.dateRail.nextDays }),
      );

      expect(scrollBy).toHaveBeenCalledTimes(2);
      expect(scrollBy.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
      expect(window.location.pathname).toBe(`/games/${nbaDate}`);
      expect(
        screen.getByRole("heading", { name: "Wednesday, October 21" }),
      ).toBeDefined();
    });
  });
});
