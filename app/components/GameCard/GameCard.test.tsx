import { render, screen } from "@testing-library/react";
import type { Game, GameStatus } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import GameCard from ".";

function buildGame(status: GameStatus): Game {
  const team = (abbreviation: string, displayName: string) => ({
    id: abbreviation,
    abbreviation,
    name: displayName,
    displayName,
    location: displayName,
    color: null,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${abbreviation}.png`,
  });

  return {
    id: "1",
    startTime: "2026-10-23T01:30Z",
    nbaDate: "2026-10-22" as NbaDate,
    seasonYear: 2027,
    seasonType: "regular",
    status,
    home: { team: team("den", "Denver Nuggets"), score: 101, winner: false },
    away: {
      team: team("okc", "Oklahoma City Thunder"),
      score: 110,
      winner: true,
    },
  };
}

describe("GameCard", () => {
  it.each<[string, GameStatus, string]>([
    [
      "live in regulation",
      { kind: "live", period: 3, clock: "4:12" },
      "Q3 4:12",
    ],
    [
      "live in overtime",
      { kind: "live", period: 6, clock: "1:05" },
      "2OT 1:05",
    ],
    ["at halftime", { kind: "halftime", period: 2 }, "Halftime"],
    ["final", { kind: "final", period: 4 }, "Final"],
    ["final after overtime", { kind: "final", period: 5 }, "Final/OT"],
    ["postponed", { kind: "postponed" }, "Postponed"],
  ])("shows the status of a game %s", (_case, status, expectedLabel) => {
    render(<GameCard game={buildGame(status)} />);

    expect(screen.getByText(expectedLabel)).toBeDefined();
  });

  it("shows scores once the game has started", () => {
    render(<GameCard game={buildGame({ kind: "final", period: 4 })} />);

    expect(screen.getByText("110")).toBeDefined();
    expect(screen.getByText("101")).toBeDefined();
  });

  it("shows the local start time instead of scores before tip-off", () => {
    render(<GameCard game={buildGame({ kind: "scheduled" })} />);

    expect(screen.queryByText("110")).toBeNull();
    expect(
      document.querySelector('time[datetime="2026-10-23T01:30Z"]')?.textContent,
    ).not.toBe("");
  });

  it("requests logos from the ESPN resizer instead of the full-size image", () => {
    render(<GameCard game={buildGame({ kind: "final", period: 4 })} />);

    const logoSources = Array.from(document.querySelectorAll("img")).map(
      (image) => image.getAttribute("src"),
    );
    expect(logoSources).toContain(
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/den.png&w=80&h=80",
    );
  });
});
