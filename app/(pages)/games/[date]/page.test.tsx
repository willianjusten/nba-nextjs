import { render, screen } from "@testing-library/react";
import GamesPage from "./page";

describe("Games by date page", () => {
  const fetchMock = vi.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        cards: [
          {
            cardData: {
              gameId: "game-1",
              gameStatus: 3,
              gameStatusText: "Final",
              period: 4,
              gameTimeUTC: "2026-03-31T01:00:00Z",
              homeTeam: { teamId: 2, teamName: "Heat", score: 99 },
              awayTeam: { teamId: 1, teamName: "Lakers", score: 101 },
            },
          },
        ],
      }),
  });

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the games page for a given date", async () => {
    const pageElement = await GamesPage({
      params: Promise.resolve({ date: "2026-03-31" }),
    });

    render(pageElement);

    expect(await screen.findByText(/lakers/i)).toBeDefined();
    expect(await screen.findByText("Heat")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("gamedate=2026-03-31"), {
      cache: "no-store",
    });
  });
});
