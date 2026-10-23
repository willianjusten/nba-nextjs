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
import currentSeason from "./lib/espn/__fixtures__/season-current.json";
import regularSeasonLeaders from "./lib/espn/__fixtures__/leaders-regular-season.json";
import leaderAthletes from "./lib/espn/__fixtures__/leaders-athletes.json";
import finalSummary from "./lib/espn/__fixtures__/summary-final.json";
import liveSummary from "./lib/espn/__fixtures__/summary-live.json";
import preGameSummary from "./lib/espn/__fixtures__/summary-pre-game.json";

const LEADERS_URL_PATTERN = /\/types\/2\/leaders\?limit=5$/;
const ATHLETE_URL_PATTERN = /\/athletes\/(\d+)$/;
const FINAL_GAME_ID = "401909092";
const LIVE_GAME_ID = "401909093";
const PRE_GAME_ID = "401909094";

function espnFixtureFor(url: string) {
  if (url.endsWith(`/summary?event=${FINAL_GAME_ID}`)) return finalSummary;
  if (url.endsWith(`/summary?event=${LIVE_GAME_ID}`)) return liveSummary;
  if (url.endsWith(`/summary?event=${PRE_GAME_ID}`)) return preGameSummary;
  if (url.endsWith("/teams/13/schedule")) return lakersSchedule;
  if (url.endsWith("/teams/13/roster")) return lakersRoster;
  if (url.endsWith("/teams/13")) return lakersDetail;
  if (url.endsWith("/teams")) return teamsList;
  if (url.endsWith("/standings?seasontype=2")) return standings;
  if (url.endsWith("/leagues/nba/season")) return currentSeason;
  if (LEADERS_URL_PATTERN.test(url)) return regularSeasonLeaders;
  const athleteId = url.match(ATHLETE_URL_PATTERN)?.[1];
  if (athleteId)
    return leaderAthletes[athleteId as keyof typeof leaderAthletes];
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
    vi.restoreAllMocks();
  });

  it("renders the home page with the current NBA date's heading, summary, and games", async () => {
    vi.useFakeTimers({
      toFake: ["Date"],
      now: new Date("2026-10-21T16:00:00Z"),
    });
    render(await HomePage());
    vi.useRealTimers();

    expect(
      screen.getByRole("heading", { name: "Wednesday, October 21" }),
    ).toBeDefined();
    expect(await screen.findByText("3 games · 3 final")).toBeDefined();
    expect(screen.getByText("Orlando Magic")).toBeDefined();
  });

  it("renders the games page with the requested date's heading, summary, and games", async () => {
    render(
      await GamesPage({ params: Promise.resolve({ date: "2026-10-21" }) }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Wednesday, October 21",
      }),
    ).toBeDefined();
    expect(await screen.findByText("3 games · 3 final")).toBeDefined();
    expect(screen.getByText("Orlando Magic")).toBeDefined();
  });

  it("returns not found for an invalid games date", async () => {
    await expect(
      GamesPage({ params: Promise.resolve({ date: "2026-02-30" }) }),
    ).rejects.toThrow();
  });

  it("renders a final game with its score, broadcasts, and leaders", async () => {
    render(await GamePage({ params: Promise.resolve({ id: FINAL_GAME_ID }) }));

    expect(
      await screen.findByRole("heading", {
        name: strings.game.title("Golden State Warriors", "Los Angeles Lakers"),
      }),
    ).toBeDefined();
    expect(screen.getByText(strings.gameStatus.final)).toBeDefined();
    expect(screen.getByText("ESPN")).toBeDefined();
    const leaders = screen.getByRole("region", {
      name: strings.game.leaders.title,
    });
    expect(within(leaders).getAllByText("Luka Doncic")).not.toHaveLength(0);
  });

  it("shows the line score per period with each team's total", async () => {
    render(await GamePage({ params: Promise.resolve({ id: FINAL_GAME_ID }) }));

    const lineScore = await screen.findByRole("region", {
      name: strings.game.lineScore.title,
    });
    const lakersRow = within(lineScore).getByRole("row", { name: /LAL/ });
    expect(
      within(lakersRow)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(["34", "32", "36", "25", "127"]);
  });

  it("shows each team's box score", async () => {
    render(await GamePage({ params: Promise.resolve({ id: FINAL_GAME_ID }) }));

    const lakersBoxScore = await screen.findByRole("region", {
      name: strings.game.boxScore.title("Los Angeles Lakers"),
    });
    expect(
      within(lakersBoxScore).getByRole("row", { name: /Z\. Williams/ }),
    ).toBeDefined();
    expect(
      within(lakersBoxScore).getByText(
        strings.game.boxScore.didNotPlay("COACH'S DECISION"),
      ),
    ).toBeDefined();
    expect(
      screen.getByRole("region", {
        name: strings.game.boxScore.title("Golden State Warriors"),
      }),
    ).toBeDefined();
  });

  it("shows the plays and the win probability", async () => {
    render(await GamePage({ params: Promise.resolve({ id: FINAL_GAME_ID }) }));

    const plays = await screen.findByRole("region", {
      name: strings.game.plays.title,
    });
    expect(within(plays).getAllByRole("listitem")).toHaveLength(50);
    expect(within(plays).getByText("End of Game")).toBeDefined();
    const winProbability = screen.getByRole("region", {
      name: strings.game.winProbability.title,
    });
    expect(
      within(winProbability).getByText(
        strings.game.winProbability.chance("LAL", "100%"),
      ),
    ).toBeDefined();
  });

  it("renders a live game with its period, clock, and latest plays", async () => {
    render(await GamePage({ params: Promise.resolve({ id: LIVE_GAME_ID }) }));

    expect(
      await screen.findByRole("heading", {
        name: strings.game.title("Cleveland Cavaliers", "Philadelphia 76ers"),
      }),
    ).toBeDefined();
    expect(screen.getByText("Q1 6:44")).toBeDefined();
    const plays = screen.getByRole("region", {
      name: strings.game.plays.title,
    });
    const latestPlay = within(plays).getAllByRole("listitem").at(-1);
    expect(latestPlay?.textContent).toContain("Joel Embiid defensive rebound");
  });

  it("renders a game that has not started yet", async () => {
    render(await GamePage({ params: Promise.resolve({ id: PRE_GAME_ID }) }));

    expect(
      await screen.findByRole("heading", {
        name: strings.game.title("Denver Nuggets", "Oklahoma City Thunder"),
      }),
    ).toBeDefined();
    expect(
      screen.queryByRole("region", { name: strings.game.lineScore.title }),
    ).toBeNull();
    expect(screen.getByText(strings.game.plays.empty)).toBeDefined();
    expect(screen.getByText(strings.game.winProbability.empty)).toBeDefined();
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

  it.each([
    ["points", "Ty Jerome", "45.0"],
    ["rebounds", "Domantas Sabonis", "18.0"],
    ["assists", "Trae Young", "13.0"],
  ] as const)(
    "shows the %s leaders with player names and photos",
    async (stat, topPlayerName, topValue) => {
      render(await StandingsPage());

      const category = screen.getByRole("region", {
        name: strings.leaders.categories[stat].title,
      });
      const [topLeader] = within(category).getAllByRole("listitem");
      expect(within(category).getAllByRole("listitem")).toHaveLength(5);
      expect(within(topLeader).getByText(topPlayerName)).toBeDefined();
      expect(within(topLeader).getByText(topValue)).toBeDefined();
      expect(
        within(topLeader).getByRole("img", { name: topPlayerName }),
      ).toBeDefined();
    },
  );

  it("shows that there are no leaders yet before the regular season has stats", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        LEADERS_URL_PATTERN.test(url)
          ? new Response(
              JSON.stringify({
                error: { message: "No stats found.", code: 404 },
              }),
              { status: 404 },
            )
          : new Response(JSON.stringify(espnFixtureFor(url))),
      ),
    );

    render(await StandingsPage());

    expect(screen.getAllByText(strings.leaders.empty)).toHaveLength(3);
  });

  it("shows an error only in the leaders category whose players cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.endsWith("/athletes/4065733")
          ? new Response(null, { status: 500 })
          : new Response(JSON.stringify(espnFixtureFor(url))),
      ),
    );

    render(await StandingsPage());

    const points = screen.getByRole("region", {
      name: strings.leaders.categories.points.title,
    });
    const rebounds = screen.getByRole("region", {
      name: strings.leaders.categories.rebounds.title,
    });
    expect(
      within(points).getByText(strings.leaders.categoryError),
    ).toBeDefined();
    expect(within(rebounds).getAllByRole("listitem")).toHaveLength(5);
  });

  it("still shows the standings when the leaders cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        LEADERS_URL_PATTERN.test(url)
          ? new Response(null, { status: 500 })
          : new Response(JSON.stringify(espnFixtureFor(url))),
      ),
    );

    render(await StandingsPage());

    expect(screen.getByText(strings.leaders.error)).toBeDefined();
    expect(
      screen.getByRole("region", { name: "Eastern Conference" }),
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
