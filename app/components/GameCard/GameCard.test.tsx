import { render, screen } from "@testing-library/react";
import type { Broadcast, Game, GameStatus } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { strings } from "@/app/lib/strings";
import GameCard from ".";

function buildGame(status: GameStatus, broadcasts: Broadcast[] = []): Game {
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
    broadcasts,
    series: null,
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

  it.each<[string, GameStatus]>([
    ["live", { kind: "live", period: 3, clock: "4:12" }],
    ["at halftime", { kind: "halftime", period: 2 }],
  ])("marks a game %s with the live chip", (_case, status) => {
    render(<GameCard game={buildGame(status)} />);

    expect(screen.getByText(strings.gameStatus.live)).toBeDefined();
  });

  it.each<[string, GameStatus, string]>([
    ["postponed", { kind: "postponed" }, "Postponed"],
    ["canceled", { kind: "canceled" }, "Canceled"],
  ])(
    "shows the PPD chip for a %s game, spelled out for screen readers",
    (_case, status, spokenLabel) => {
      render(<GameCard game={buildGame(status)} />);

      const chip = screen.getByText(strings.gameStatus.postponedShort);
      expect(chip.getAttribute("aria-hidden")).toBe("true");
      expect(screen.getByText(spokenLabel).className).toContain("sr-only");
    },
  );

  it("does not show the live chip for a finished game", () => {
    render(<GameCard game={buildGame({ kind: "final", period: 4 })} />);

    expect(screen.queryByText(strings.gameStatus.live)).toBeNull();
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

  it("shows the broadcast channels in the order given", () => {
    render(
      <GameCard
        game={buildGame({ kind: "scheduled" }, [
          { name: "ESPN", market: "national" },
          { name: "NBA League Pass", market: "home" },
        ])}
      />,
    );

    expect(screen.getByText("ESPN · NBA League Pass").textContent).toBe(
      "Broadcast: ESPN · NBA League Pass",
    );
  });

  it("renders no channel element when no broadcast is listed", () => {
    render(<GameCard game={buildGame({ kind: "scheduled" })} />);

    expect(screen.queryByText(/Broadcast/)).toBeNull();
  });
});
