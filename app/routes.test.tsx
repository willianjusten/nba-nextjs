import {
  render as renderWithoutProviders,
  screen,
  within,
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
import lakersSchedule from "./lib/espn/__fixtures__/team-schedule-lakers.json";
import lakersRoster from "./lib/espn/__fixtures__/team-roster-lakers.json";
import standings from "./lib/espn/__fixtures__/standings-regular-season.json";

function espnFixtureFor(url: string) {
  if (url.endsWith("/teams/13/schedule")) return lakersSchedule;
  if (url.endsWith("/teams/13/roster")) return lakersRoster;
  if (url.endsWith("/teams/13")) return lakersDetail;
  if (url.endsWith("/teams")) return teamsList;
  if (url.endsWith("/standings?seasontype=2")) return standings;
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

  it("renders the standings page for the current season", async () => {
    render(await StandingsPage());

    expect(
      screen.getByRole("heading", { name: strings.standings.title }),
    ).toBeDefined();
    expect(
      screen.getByText(strings.standings.regularSeason("2026-27")),
    ).toBeDefined();
  });

  it.each([
    ["Eastern Conference", "Indiana Pacers"],
    ["Western Conference", "Minnesota Timberwolves"],
  ])(
    "lists the %s standings in seed order",
    async (conferenceName, leaderName) => {
      render(await StandingsPage());

      const conference = screen.getByRole("region", { name: conferenceName });
      const [, leaderRow] = within(conference).getAllByRole("row");
      expect(within(conference).getAllByRole("row")).toHaveLength(16);
      expect(
        within(leaderRow).getByRole("link", { name: leaderName }),
      ).toBeDefined();
    },
  );

  it("shows each team's record in the standings", async () => {
    render(await StandingsPage());

    const east = screen.getByRole("region", { name: "Eastern Conference" });
    const leaderRow = within(east).getByRole("row", { name: /Indiana Pacers/ });
    expect(
      within(leaderRow)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual([
      "1",
      "Indiana Pacers",
      "1",
      "0",
      "1.000",
      "-",
      "0-0",
      "1-0",
      "1-0",
      "W1",
    ]);
  });

  it("links each standings team to its team page", async () => {
    render(await StandingsPage());

    expect(
      screen.getByRole("link", { name: "Indiana Pacers" }).getAttribute("href"),
    ).toBe("/teams/pacers");
  });

  it("renders the team page for the requested slug", async () => {
    render(await TeamPage({ params: Promise.resolve({ slug: "lakers" }) }));

    expect(
      screen.getByRole("heading", { name: "Los Angeles Lakers" }),
    ).toBeDefined();
    expect(screen.getByText(strings.team.record("1-0"))).toBeDefined();
    expect(screen.getByText("1st in Pacific Division")).toBeDefined();
  });

  it("lists the team's past games with final scores", async () => {
    render(await TeamPage({ params: Promise.resolve({ slug: "lakers" }) }));

    const results = screen.getByRole("region", {
      name: strings.team.schedule.results,
    });
    expect(within(results).getAllByRole("listitem")).toHaveLength(1);
    expect(within(results).getByText(/Golden State Warriors/)).toBeDefined();
    expect(
      within(results).getByText(strings.team.schedule.result(true, 127, 105)),
    ).toBeDefined();
  });

  it("lists the team's upcoming games with their start times", async () => {
    render(await TeamPage({ params: Promise.resolve({ slug: "lakers" }) }));

    const upcoming = screen.getByRole("region", {
      name: strings.team.schedule.upcoming,
    });
    const upcomingGames = within(upcoming).getAllByRole("listitem");
    expect(upcomingGames).toHaveLength(4);
    expect(within(upcomingGames[0]).getByText(/LA Clippers/)).toBeDefined();
    expect(
      upcomingGames[0].querySelector("time")?.getAttribute("dateTime"),
    ).toBe("2026-10-24T02:00Z");
  });

  it("shows the team's roster", async () => {
    render(await TeamPage({ params: Promise.resolve({ slug: "lakers" }) }));

    const roster = screen.getByRole("region", {
      name: strings.team.roster.title,
    });
    expect(within(roster).getAllByRole("row")).toHaveLength(19);
    expect(
      within(roster).getByRole("row", { name: /Luka Doncic/ }),
    ).toBeDefined();
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
