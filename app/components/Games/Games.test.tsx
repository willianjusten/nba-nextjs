import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Games from ".";

describe("Games component", () => {
  const sampleData = {
    gameDate: "2026-03-31",
    games: [
      {
        gameId: "game-1",
        awayTeam: { teamId: 1, teamName: "Lakers", score: 101 },
        homeTeam: { teamId: 2, teamName: "Heat", score: 99 },
        gameStatus: 3,
        gameStatusText: "Final",
        broadcaster: "",
        gameTimeUTC: "2026-03-31T01:00:00Z",
        period: 4,
      },
    ],
  };

  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(sampleData),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders games from the /api/today endpoint", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <Games />
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/lakers/i)).toBeDefined();
    expect(await screen.findByText("Heat")).toBeDefined();
    expect(screen.getByText("Games")).toBeDefined();
  });
});
