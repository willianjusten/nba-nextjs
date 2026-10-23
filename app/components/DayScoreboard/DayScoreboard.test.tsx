import { QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import noGames from "@/app/lib/espn/__fixtures__/scoreboard-no-games.json";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
import { strings } from "@/app/lib/strings";
import DayScoreboard from ".";

const nbaDate = "2026-10-21" as NbaDate;
const fetchMock = vi.fn();

function renderDayScoreboard() {
  const queryClient = makeQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false } });

  return render(
    <QueryClientProvider client={queryClient}>
      <DayScoreboard nbaDate={nbaDate} />
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

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
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

    expect(await screen.findByText("Orlando Magic")).toBeDefined();
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
    expect(screen.queryByText(/\d+ games?/)).toBeNull();
    expect(screen.queryByText("Orlando Magic")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(finalDay));
    fireEvent.click(screen.getByRole("button", { name: strings.games.retry }));

    expect(await screen.findByText("Orlando Magic")).toBeDefined();
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
    expect(await screen.findByText("Philadelphia 76ers")).toBeDefined();

    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));
    returnToTab();

    const staleNotice = await screen.findByText(strings.games.stale(1));
    expect(staleNotice.closest("[role=status]")?.textContent).toContain(
      strings.games.retryingAutomatically,
    );
    expect(screen.getByText("Philadelphia 76ers")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(liveDay));
    returnToTab();

    await vi.waitFor(() =>
      expect(screen.queryByText(strings.games.stale(1))).toBeNull(),
    );
    expect(screen.getByText("Philadelphia 76ers")).toBeDefined();
    vi.useRealTimers();
  });
});
