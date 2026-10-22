import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import noGames from "@/app/lib/espn/__fixtures__/scoreboard-no-games.json";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
import { strings } from "@/app/lib/strings";
import GamesList from ".";

const nbaDate = "2026-10-21" as NbaDate;
const fetchMock = vi.fn();

function renderGamesList() {
  const queryClient = makeQueryClient();
  queryClient.setDefaultOptions({ queries: { retry: false } });

  return render(
    <QueryClientProvider client={queryClient}>
      <GamesList nbaDate={nbaDate} />
    </QueryClientProvider>,
  );
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

describe("GamesList", () => {
  it("shows a loading state while the scoreboard is fetching", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));

    renderGamesList();

    expect(screen.getByRole("status").textContent).toContain(
      strings.games.loading,
    );
  });

  it("shows the games once the scoreboard loads", async () => {
    fetchMock.mockResolvedValue(jsonResponse(finalDay));

    renderGamesList();

    expect(await screen.findByText("Orlando Magic")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows an error with a retry button that reloads the games", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));

    renderGamesList();

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert.textContent).toContain(strings.games.error);
    expect(screen.queryByText(strings.games.empty)).toBeNull();
    expect(screen.queryByText("Orlando Magic")).toBeNull();

    fetchMock.mockResolvedValueOnce(jsonResponse(finalDay));
    fireEvent.click(screen.getByRole("button", { name: strings.games.retry }));

    expect(await screen.findByText("Orlando Magic")).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows a specific empty state on a day without games", async () => {
    fetchMock.mockResolvedValue(jsonResponse(noGames));

    renderGamesList();

    expect(await screen.findByText(strings.games.empty)).toBeDefined();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
