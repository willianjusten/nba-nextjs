import { QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import finalSummary from "@/app/lib/espn/__fixtures__/summary-final.json";
import liveSummary from "@/app/lib/espn/__fixtures__/summary-live.json";
import preGameSummary from "@/app/lib/espn/__fixtures__/summary-pre-game.json";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
import { strings } from "@/app/lib/strings";
import GameDetail from ".";

const GAME_ID = "401909093";
const GAME_DETAIL_POLLING_MS = 8_000;
const DURING_LIVE_GAME = new Date("2026-10-22T23:45:00Z");
// Five minutes before the pre-game fixture's 01:30Z tip-off, inside the pre-game polling window.
const SHORTLY_BEFORE_TIP_OFF = new Date("2026-10-23T01:25:00Z");
const HOURS_BEFORE_TIP_OFF = new Date("2026-10-22T22:00:00Z");
const ONE_MINUTE_BEFORE_POLLING_WINDOW = new Date("2026-10-23T01:19:00Z");
const ONE_MINUTE_MS = 60_000;

// The same live game after the final buzzer, so the polled game does not change identity mid-test.
const liveGameEndedSummary = {
  ...liveSummary,
  header: {
    ...liveSummary.header,
    competitions: [
      {
        ...liveSummary.header.competitions[0],
        status: finalSummary.header.competitions[0].status,
      },
    ],
  },
};

const fetchMock = vi.fn();

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

function renderGameDetail() {
  const queryClient = makeQueryClient();
  // setDefaultOptions replaces the defaults, so the app's staleTime is kept to prove the focus refetch ignores it.
  const appDefaults = queryClient.getDefaultOptions();
  queryClient.setDefaultOptions({
    ...appDefaults,
    queries: { ...appDefaults.queries, retry: false },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <GameDetail gameId={GAME_ID} />
    </QueryClientProvider>,
  );
}

async function renderLoadedGameDetail(summary: unknown, now: Date) {
  vi.useFakeTimers({ now, shouldAdvanceTime: true });
  fetchMock.mockResolvedValueOnce(jsonResponse(summary));
  renderGameDetail();
  expect(await screen.findByRole("heading", { level: 1 })).toBeDefined();
  expect(fetchMock).toHaveBeenCalledTimes(1);
}

async function waitOnePollingInterval() {
  await act(() => vi.advanceTimersByTimeAsync(GAME_DETAIL_POLLING_MS));
}

function setTabVisibility(visibilityState: DocumentVisibilityState) {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(visibilityState);
  act(() => {
    window.dispatchEvent(new Event("visibilitychange"));
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GameDetail live polling", () => {
  it("refetches the summary every 8 seconds while the game is live", async () => {
    await renderLoadedGameDetail(liveSummary, DURING_LIVE_GAME);

    fetchMock.mockResolvedValue(jsonResponse(liveSummary));
    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("polls a game that tips off within 10 minutes", async () => {
    await renderLoadedGameDetail(preGameSummary, SHORTLY_BEFORE_TIP_OFF);

    fetchMock.mockResolvedValue(jsonResponse(preGameSummary));
    await waitOnePollingInterval();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not poll a game that tips off hours from now", async () => {
    await renderLoadedGameDetail(preGameSummary, HOURS_BEFORE_TIP_OFF);

    await waitOnePollingInterval();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("starts polling when the game enters the 10-minute pre-game window", async () => {
    await renderLoadedGameDetail(
      preGameSummary,
      ONE_MINUTE_BEFORE_POLLING_WINDOW,
    );
    fetchMock.mockResolvedValue(jsonResponse(preGameSummary));

    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(() => vi.advanceTimersByTimeAsync(ONE_MINUTE_MS));
    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("stops polling once the game is final", async () => {
    await renderLoadedGameDetail(liveSummary, DURING_LIVE_GAME);

    fetchMock.mockResolvedValue(jsonResponse(liveGameEndedSummary));
    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText(strings.gameStatus.final)).toBeDefined();

    await waitOnePollingInterval();
    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("pauses polling while the tab is hidden and refetches on return", async () => {
    await renderLoadedGameDetail(liveSummary, DURING_LIVE_GAME);

    fetchMock.mockResolvedValue(jsonResponse(liveSummary));
    setTabVisibility("hidden");
    await waitOnePollingInterval();
    await waitOnePollingInterval();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    setTabVisibility("visible");
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("keeps the last data with a stale notice when a refetch fails, and clears it after recovery", async () => {
    await renderLoadedGameDetail(liveSummary, DURING_LIVE_GAME);

    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));
    await waitOnePollingInterval();

    expect(await screen.findByText(strings.game.stale)).toBeDefined();
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(liveSummary));
    await waitOnePollingInterval();

    await vi.waitFor(() =>
      expect(screen.queryByText(strings.game.stale)).toBeNull(),
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  });
});
