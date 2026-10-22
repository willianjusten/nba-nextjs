import {
  render as renderWithoutProviders,
  screen,
} from "@testing-library/react";
import type { ReactElement } from "react";
import Providers from "./providers";
import { strings } from "@/app/lib/strings";
import HomePage from "./page";
import GamesPage from "./games/[date]/page";
import GamePage from "./game/[id]/page";
import StandingsPage from "./standings/page";
import TeamPage from "./teams/[slug]/page";
import PlayoffsPage from "./playoffs/page";

function render(ui: ReactElement) {
  return renderWithoutProviders(ui, { wrapper: Providers });
}

describe("route placeholders", () => {
  it("renders the home page", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: strings.home.title }),
    ).toBeDefined();
    expect(screen.getByText(strings.common.comingSoon)).toBeDefined();
  });

  it("renders the games page for the requested date", async () => {
    const nbaDate = "2026-10-22";

    render(await GamesPage({ params: Promise.resolve({ date: nbaDate }) }));

    expect(
      screen.getByRole("heading", { name: strings.games.title(nbaDate) }),
    ).toBeDefined();
  });

  it("renders the game page for the requested game", async () => {
    const gameId = "401810001";

    render(await GamePage({ params: Promise.resolve({ id: gameId }) }));

    expect(
      screen.getByRole("heading", { name: strings.game.title(gameId) }),
    ).toBeDefined();
  });

  it("renders the standings page", () => {
    render(<StandingsPage />);

    expect(
      screen.getByRole("heading", { name: strings.standings.title }),
    ).toBeDefined();
  });

  it("renders the team page for the requested slug", async () => {
    const teamSlug = "lakers";

    render(await TeamPage({ params: Promise.resolve({ slug: teamSlug }) }));

    expect(
      screen.getByRole("heading", { name: strings.team.title(teamSlug) }),
    ).toBeDefined();
  });

  it("renders the playoffs page", () => {
    render(<PlayoffsPage />);

    expect(
      screen.getByRole("heading", { name: strings.playoffs.title }),
    ).toBeDefined();
  });
});
