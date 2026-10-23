import { act, render, screen, within } from "@testing-library/react";
import currentSeason from "@/app/lib/espn/__fixtures__/season-current.json";
import regularSeasonLeaders from "@/app/lib/espn/__fixtures__/leaders-regular-season.json";
import leaderAthletes from "@/app/lib/espn/__fixtures__/leaders-athletes.json";
import standings from "@/app/lib/espn/__fixtures__/standings-regular-season.json";
import { favoritesStore } from "@/app/lib/favorites/use-favorite-team-ids";
import { strings } from "@/app/lib/strings";
import HomeSidebar from ".";

const LEADERS_URL_PATTERN = /\/types\/2\/leaders\?limit=5$/;
const ATHLETE_URL_PATTERN = /\/athletes\/(\d+)$/;
const STANDINGS_URL_SUFFIX = "/standings?seasontype=2";
const ATLANTA_TEAM_ID = "1";

function espnFixtureFor(url: string) {
  if (url.endsWith(STANDINGS_URL_SUFFIX)) return standings;
  if (url.endsWith("/leagues/nba/season")) return currentSeason;
  if (LEADERS_URL_PATTERN.test(url)) return regularSeasonLeaders;
  const athleteId = url.match(ATHLETE_URL_PATTERN)?.[1];
  return leaderAthletes[athleteId as keyof typeof leaderAthletes];
}

function respondWithEspn({ failing }: { failing?: RegExp } = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      failing?.test(url)
        ? new Response(null, { status: 500 })
        : new Response(JSON.stringify(espnFixtureFor(url))),
    ),
  );
}

function standingsPanel() {
  return screen.getByRole("region", { name: /top 5/ });
}

function leadersPanel() {
  return screen.getByRole("region", {
    name: strings.home.sidebar.leadersTitle,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  act(() => favoritesStore().remove(ATLANTA_TEAM_ID));
});

describe("HomeSidebar", () => {
  it("shows the West top 5 with a link to the full standings", async () => {
    respondWithEspn();

    render(await HomeSidebar());

    const panel = standingsPanel();
    expect(
      within(panel).getByRole("heading", { name: "West top 5" }),
    ).toBeDefined();
    expect(
      within(panel)
        .getByRole("link", { name: strings.home.sidebar.allStandingsLabel })
        .getAttribute("href"),
    ).toBe("/standings");
    expect(within(panel).getAllByRole("listitem")).toHaveLength(5);
  });

  it("shows the first favorite team's conference with that team highlighted", async () => {
    respondWithEspn();
    act(() => favoritesStore().add(ATLANTA_TEAM_ID));

    render(await HomeSidebar());

    const panel = standingsPanel();
    expect(
      within(panel).getByRole("heading", { name: "East top 5" }),
    ).toBeDefined();
    const atlantaRow = within(panel)
      .getByText("Hawks")
      .closest("li") as HTMLElement;
    expect(
      within(atlantaRow).getByText(strings.home.sidebar.favorite),
    ).toBeDefined();
  });

  it("shows each category's leader with a headshot and the next two runners-up", async () => {
    respondWithEspn();

    render(await HomeSidebar());

    const points = within(leadersPanel()).getByRole("region", {
      name: strings.home.sidebar.categories.points,
    });
    expect(
      within(points).getByRole("img", { name: "Ty Jerome" }),
    ).toBeDefined();
    expect(within(points).getByText("45.0")).toBeDefined();
    expect(within(points).getAllByRole("listitem")).toHaveLength(2);
  });

  it("still shows the leaders when the standings cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    respondWithEspn({ failing: /\/standings\?/ });

    render(await HomeSidebar());

    expect(screen.getByText(strings.home.sidebar.standingsError)).toBeDefined();
    expect(within(leadersPanel()).getByText("45.0")).toBeDefined();
  });

  it("still shows the standings when the leaders cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    respondWithEspn({ failing: LEADERS_URL_PATTERN });

    render(await HomeSidebar());

    expect(
      within(leadersPanel()).getByText(strings.leaders.error),
    ).toBeDefined();
    expect(within(standingsPanel()).getAllByRole("listitem")).toHaveLength(5);
  });
});
