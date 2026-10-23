import { render, screen } from "@testing-library/react";
import type { Game } from "@/app/lib/domain/game";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import finalDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import internationalExhibition from "@/app/lib/espn/__fixtures__/scoreboard-international-exhibition.json";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import scheduledDay from "@/app/lib/espn/__fixtures__/scoreboard-scheduled-day.json";
import { mapGame } from "@/app/lib/espn/mappers";
import type { RawEvent } from "@/app/lib/espn/raw-types";
import { buildHomeView, type HomeCard } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";
import GameCard from ".";

const gamesOf = (fixture: { events: unknown[] }) =>
  fixture.events.map((event) => mapGame(event as RawEvent));

const [finalGame] = gamesOf(finalDay);
const [liveGame] = gamesOf(liveDay);
const [, scheduledGame] = gamesOf(scheduledDay);
const [exhibitionGame] = gamesOf(internationalExhibition);

function cardFor(game: Game, timeZone: string | null = "America/New_York") {
  const { screen: homeScreen } = buildHomeView({
    selectedDate: game.nbaDate as NbaDate,
    railCenterDate: game.nbaDate as NbaDate,
    today: game.nbaDate as NbaDate,
    query: {
      status: "success",
      scoreboard: { nbaDate: game.nbaDate, games: [game], nextGameDate: null },
    },
    gameCounts: null,
    now: new Date("2026-10-23T00:00:00Z"),
    timeZone,
  });
  if (homeScreen.kind !== "games") throw new Error("Expected a games screen");
  return homeScreen.cards[0];
}

const renderCard = (card: HomeCard) => render(<GameCard card={card} />);

describe("GameCard", () => {
  it("links the whole card to the game center, named after the matchup", () => {
    renderCard(cardFor(finalGame));

    const cardLink = screen.getByRole("link", {
      name: "Atlanta Hawks at Orlando Magic",
    });
    expect(cardLink.getAttribute("href")).toBe(`/game/${finalGame.id}`);
  });

  it("offers highlights and recap on a final, linking to the game center", () => {
    renderCard(cardFor(finalGame));

    const highlightsLink = screen.getByRole("link", {
      name: strings.gameCard.highlights,
    });
    expect(highlightsLink.getAttribute("href")).toBe(`/game/${finalGame.id}`);
    expect(
      screen.getByRole("img", { name: strings.gameCard.winner }),
    ).toBeDefined();
  });

  it("marks a live game with the live chip, its meta line, and a game center link", () => {
    renderCard(cardFor(liveGame));

    expect(screen.getByText(strings.gameStatus.live)).toBeDefined();
    expect(screen.getByText("Q2 · 7:11 · ESPN")).toBeDefined();
    expect(
      screen.getByRole("link", { name: strings.gameCard.gameDetails }),
    ).toBeDefined();
    expect(
      screen.queryByRole("link", { name: strings.gameCard.highlights }),
    ).toBeNull();
  });

  it("shows the win probability of both teams on a live game", () => {
    renderCard(cardFor({ ...liveGame, homeWinProbability: 0.68 }));

    expect(screen.getByText("CLE 32%")).toBeDefined();
    expect(screen.getByText(strings.gameCard.winProbability)).toBeDefined();
    expect(screen.getByText("PHI 68%")).toBeDefined();
  });

  it("shows the top scorer on a live game", () => {
    renderCard(cardFor({ ...liveGame, topScorer: finalGame.topScorer }));

    expect(screen.getByText(strings.gameCard.topScorer)).toBeDefined();
    expect(screen.getByText("P. Banchero · 35 PTS 7 REB 10 AST")).toBeDefined();
  });

  it("hides the win probability and top scorer when ESPN sends neither", () => {
    renderCard(
      cardFor({ ...liveGame, homeWinProbability: null, topScorer: null }),
    );

    expect(screen.queryByText(strings.gameCard.winProbability)).toBeNull();
    expect(screen.queryByText(strings.gameCard.topScorer)).toBeNull();
  });

  it("shows team names, records, and scores", () => {
    renderCard(cardFor(liveGame));

    expect(screen.getByText("76ers")).toBeDefined();
    expect(screen.getByText("1-0")).toBeDefined();
    expect(screen.getByText("52")).toBeDefined();
    expect(screen.getByText("48")).toBeDefined();
  });

  it("shows the tip-off, venue, and channel instead of scores before the game", () => {
    renderCard(cardFor(scheduledGame));

    expect(screen.getByText("9:30 PM")).toBeDefined();
    expect(screen.getByText("ESPN")).toBeDefined();
    expect(screen.getByText("Paycom Center")).toBeDefined();
    expect(screen.queryByText("0")).toBeNull();
  });

  it("keeps the tip-off element empty until the browser timezone is known", () => {
    renderCard(cardFor(scheduledGame, null));

    const tipOff = document.querySelector(
      `time[datetime="${scheduledGame.startTime}"]`,
    );
    expect(tipOff?.textContent).toBe("");
  });

  it("shows the PPD chip for a postponed game, spelled out for screen readers", () => {
    renderCard(cardFor({ ...finalGame, status: { kind: "postponed" } }));

    const chip = screen.getByText(strings.gameStatus.postponedShort);
    expect(chip.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText(strings.gameStatus.postponed).className).toContain(
      "sr-only",
    );
  });

  it("requests logos from the ESPN resizer instead of the full-size image", () => {
    renderCard(cardFor(finalGame));

    const logoSources = Array.from(document.querySelectorAll("img")).map(
      (image) => image.getAttribute("src"),
    );
    expect(logoSources).toContain(
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/orl.png&w=68&h=68",
    );
  });

  it("shows a generic shield for a team without an ESPN logo", () => {
    renderCard(cardFor(exhibitionGame));

    expect(screen.getByTestId("generic-team-logo")).toBeDefined();
    expect(document.querySelectorAll("img")).toHaveLength(1);
  });
});
