import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home page", () => {
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

  beforeEach(() => {
    vi.stubEnv("API_DOMAIN", "http://localhost");
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

  it("renders the home page with games data", async () => {
    const pageElement = await Page();
    render(pageElement);

    expect(await screen.findByText(/lakers/i)).toBeDefined();
    expect(await screen.findByText("Heat")).toBeDefined();
  });
});
