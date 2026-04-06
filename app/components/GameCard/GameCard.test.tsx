import { render, screen } from "@testing-library/react";
import { GAME_STATUS } from "@/app/constants";
import GameCard from ".";

describe("GameCard", () => {
  const defaultProps = {
    gameId: "game-1",
    awayTeam: {
      teamId: 1,
      teamName: "Lakers",
      triCode: "LAL",
      score: 101,
      wins: 30,
      losses: 20,
    },
    homeTeam: {
      teamId: 2,
      teamName: "Heat",
      triCode: "MIA",
      score: 99,
      wins: 28,
      losses: 22,
    },
    gameStatus: GAME_STATUS.ENDED,
    gameStatusText: "Final",
    broadcaster: "ABC",
    gameTimeUTC: new Date("2026-03-31T01:00:00Z"),
    period: 4,
  } as const;

  it("renders teams, scores, and details footer", () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText(/lakers/i)).toBeDefined();
    expect(screen.getByText("Heat")).toBeDefined();
    expect(screen.getByText("99")).toBeDefined();
    expect(screen.getByText(/view details/i)).toBeDefined();
  });

  it("renders the live indicator when the game is in progress", () => {
    render(
      <GameCard {...defaultProps} gameStatus={GAME_STATUS.IN_PROGRESS} gameStatusText="Q2 05:00" />,
    );

    expect(screen.getByText("Live")).toBeDefined();
  });
});
