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
import finalDay from "./lib/espn/__fixtures__/scoreboard-final-day.json";
import teamsList from "./lib/espn/__fixtures__/teams-list.json";
import lakersDetail from "./lib/espn/__fixtures__/team-detail-lakers.json";

function espnFixtureFor(url: string) {
  if (url.includes("/teams/13")) return lakersDetail;
  if (url.endsWith("/teams")) return teamsList;
  return finalDay;
}

function render(ui: ReactElement) {
  return renderWithoutProviders(ui, { wrapper: Providers });
}

describe("routes", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async (url: string) =>
          new Response(JSON.stringify(espnFixtureFor(url))),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the home page with the current NBA date's games", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", { name: strings.home.title }),
    ).toBeDefined();
    expect(await screen.findByText("Orlando Magic")).toBeDefined();
  });

  it("renders the games page for the requested date", async () => {
    render(
      await GamesPage({ params: Promise.resolve({ date: "2026-10-21" }) }),
    );

    expect(
      screen.getByRole("heading", {
        name: strings.games.title("Wednesday, October 21"),
      }),
    ).toBeDefined();
    expect(await screen.findByText("Orlando Magic")).toBeDefined();
  });

  it("returns not found for an invalid games date", async () => {
    await expect(
      GamesPage({ params: Promise.resolve({ date: "2026-02-30" }) }),
    ).rejects.toThrow();
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
    render(await TeamPage({ params: Promise.resolve({ slug: "lakers" }) }));

    expect(
      screen.getByRole("heading", { name: "Los Angeles Lakers" }),
    ).toBeDefined();
    expect(screen.getByText(strings.team.record("1-0"))).toBeDefined();
    expect(screen.getByText("1st in Pacific Division")).toBeDefined();
  });

  it("returns not found for an unknown team slug", async () => {
    await expect(
      TeamPage({ params: Promise.resolve({ slug: "supersonics" }) }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("renders the playoffs page", () => {
    render(<PlayoffsPage />);

    expect(
      screen.getByRole("heading", { name: strings.playoffs.title }),
    ).toBeDefined();
  });
});
