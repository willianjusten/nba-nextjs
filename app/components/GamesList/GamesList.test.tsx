import { render, screen } from "@testing-library/react";
import GamesList from ".";

describe("GamesList", () => {
  it("renders fallback text when there are no games", () => {
    render(<GamesList />);

    expect(screen.getByText("No games today :(")).toBeDefined();
  });

  it("renders a link for each game", () => {
    render(
      <GamesList
        games={[
          {
            gameId: "game-1",
            awayTeam: {
              teamId: 1,
              teamName: "Lakers",
              teamTricode: "LAL",
              wins: 30,
              losses: 20,
              score: 101,
            },
            homeTeam: {
              teamId: 2,
              teamName: "Heat",
              teamTricode: "MIA",
              wins: 28,
              losses: 22,
              score: 99,
            },
            gameStatus: 3,
            gameStatusText: "Final",
            gameClock: "",
            broadcaster: "",
            gameTimeUTC: "2026-03-31T01:00:00Z",
            period: 4,
          },
        ]}
      />,
    );

    expect(screen.getByText(/lakers/i)).toBeDefined();
    expect(screen.getByText("Heat")).toBeDefined();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/game/game-1");
  });
});
