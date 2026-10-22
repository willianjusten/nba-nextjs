// @vitest-environment node
import { fetchLeaders } from "@/app/lib/espn/leaders";
import currentSeason from "./__fixtures__/season-current.json";
import regularSeasonLeaders from "./__fixtures__/leaders-regular-season.json";
import leaderAthletes from "./__fixtures__/leaders-athletes.json";

const ONE_HOUR_IN_SECONDS = 60 * 60;
const CORE_NBA_URL =
  "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba";
const SEASON_URL = `${CORE_NBA_URL}/season`;
const LEADERS_URL = `${CORE_NBA_URL}/seasons/2027/types/2/leaders?limit=5`;
const ATHLETE_URL_PATTERN = /\/seasons\/2027\/athletes\/(\d+)$/;

type AthleteId = keyof typeof leaderAthletes;

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function respondWithEspn({
  leaders = regularSeasonLeaders as unknown,
  athletes = leaderAthletes as Record<string, unknown>,
  leadersStatus = 200,
} = {}) {
  fetchMock.mockImplementation(async (url: string) => {
    if (url === SEASON_URL) return jsonResponse(currentSeason);
    if (url === LEADERS_URL) return jsonResponse(leaders, leadersStatus);

    const athleteId = url.match(ATHLETE_URL_PATTERN)?.[1];
    const athlete = athleteId ? athletes[athleteId] : undefined;
    return athlete ? jsonResponse(athlete) : jsonResponse({}, 404);
  });
}

function athleteRequests() {
  return fetchMock.mock.calls
    .map(([url]) => url as string)
    .filter((url) => ATHLETE_URL_PATTERN.test(url));
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchLeaders", () => {
  it("requests the top 5 regular season leaders of the season derived from ESPN, revalidating hourly", async () => {
    respondWithEspn();

    await fetchLeaders();

    const hourlyRevalidation = expect.objectContaining({
      next: { revalidate: ONE_HOUR_IN_SECONDS },
    });
    expect(fetchMock).toHaveBeenCalledWith(SEASON_URL, hourlyRevalidation);
    expect(fetchMock).toHaveBeenCalledWith(LEADERS_URL, hourlyRevalidation);
    expect(fetchMock).toHaveBeenCalledWith(
      `${CORE_NBA_URL}/seasons/2027/athletes/4065733`,
      hourlyRevalidation,
    );
  });

  it("returns points, rebounds, and assists leaders in that order", async () => {
    respondWithEspn();

    const categories = await fetchLeaders();

    expect(
      categories.map(({ stat, leaders }) => [stat, leaders?.length]),
    ).toEqual([
      ["points", 5],
      ["rebounds", 5],
      ["assists", 5],
    ]);
  });

  it("maps each leader with the resolved athlete's name and photo", async () => {
    respondWithEspn();

    const [points, rebounds] = await fetchLeaders();

    expect(points.leaders?.[0]).toEqual({
      athlete: {
        id: "4065733",
        displayName: "Ty Jerome",
        headshotUrl:
          "https://a.espncdn.com/i/headshots/nba/players/full/4065733.png",
      },
      value: 45,
      displayValue: "45.0",
    });
    expect(
      rebounds.leaders?.map((leader) => [
        leader.athlete.displayName,
        leader.displayValue,
      ]),
    ).toEqual([
      ["Domantas Sabonis", "18.0"],
      ["Rudy Gobert", "15.0"],
      ["Ivica Zubac", "15.0"],
      ["Andre Drummond", "14.0"],
      ["Jalen Johnson", "14.0"],
    ]);
  });

  it("resolves only the top 5 athletes of each category", async () => {
    const withMoreLeaders = structuredClone(regularSeasonLeaders);
    const [points, assists] = withMoreLeaders.categories;
    points.leaders.push(...assists.leaders);
    respondWithEspn({ leaders: withMoreLeaders });

    const [pointsLeaders] = await fetchLeaders();

    expect(pointsLeaders.leaders).toHaveLength(5);
    expect(athleteRequests()).toHaveLength(15);
  });

  it("resolves an athlete who leads several categories only once", async () => {
    const withRepeatedLeader = structuredClone(regularSeasonLeaders);
    const [points, assists] = withRepeatedLeader.categories;
    assists.leaders[0] = {
      ...assists.leaders[0],
      athlete: points.leaders[0].athlete,
    };
    respondWithEspn({ leaders: withRepeatedLeader });

    const [, , assistsLeaders] = await fetchLeaders();

    expect(assistsLeaders.leaders?.[0].athlete.displayName).toBe("Ty Jerome");
    expect(
      athleteRequests().filter((url) => url.endsWith("/athletes/4065733")),
    ).toHaveLength(1);
  });

  it("resolves athlete refs on ESPN's internal .pvt host through the public host", async () => {
    const withPrivateRefs = JSON.parse(
      JSON.stringify(regularSeasonLeaders).replaceAll(
        "http://sports.core.api.espn.com",
        "http://sports.core.api.espn.pvt",
      ),
    );
    respondWithEspn({ leaders: withPrivateRefs });

    const [points] = await fetchLeaders();

    expect(points.leaders?.[0].athlete.displayName).toBe("Ty Jerome");
    expect(athleteRequests()).toContain(
      `${CORE_NBA_URL}/seasons/2027/athletes/4065733`,
    );
  });

  it("maps an athlete without a headshot to a null photo", async () => {
    const tyJeromeId: AthleteId = "4065733";
    const { headshot: _headshot, ...withoutHeadshot } =
      leaderAthletes[tyJeromeId];
    respondWithEspn({
      athletes: { ...leaderAthletes, [tyJeromeId]: withoutHeadshot },
    });

    const [points] = await fetchLeaders();

    expect(points.leaders?.[0].athlete.headshotUrl).toBeNull();
  });

  it("returns empty categories when ESPN has no stats for the season yet", async () => {
    respondWithEspn({
      leaders: { error: { message: "No stats found.", code: 404 } },
      leadersStatus: 404,
    });

    const categories = await fetchLeaders();

    expect(categories.map(({ stat, leaders }) => [stat, leaders])).toEqual([
      ["points", []],
      ["rebounds", []],
      ["assists", []],
    ]);
    expect(athleteRequests()).toHaveLength(0);
  });

  it("throws instead of showing no leaders when the leaders endpoint is not found for another reason", async () => {
    respondWithEspn({
      leaders: { error: { message: "Not found", code: 404 } },
      leadersStatus: 404,
    });

    await expect(fetchLeaders()).rejects.toThrow(/404/);
  });

  it("throws instead of showing no leaders when a category is missing", async () => {
    const withoutRebounds = structuredClone(regularSeasonLeaders);
    withoutRebounds.categories = withoutRebounds.categories.filter(
      (category) => category.name !== "reboundsPerGame",
    );
    respondWithEspn({ leaders: withoutRebounds });

    await expect(fetchLeaders()).rejects.toThrow(/reboundsPerGame/);
  });

  it("marks only the category of an unresolved athlete as failed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { "4065733": _tyJerome, ...athletesWithoutTyJerome } = leaderAthletes;
    respondWithEspn({ athletes: athletesWithoutTyJerome });

    const categories = await fetchLeaders();

    expect(
      categories.map(({ stat, leaders }) => [stat, leaders?.length ?? null]),
    ).toEqual([
      ["points", null],
      ["rebounds", 5],
      ["assists", 5],
    ]);
  });

  it("fails every category an unresolved athlete leads", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const withRepeatedLeader = structuredClone(regularSeasonLeaders);
    const [points, assists] = withRepeatedLeader.categories;
    assists.leaders[0] = {
      ...assists.leaders[0],
      athlete: points.leaders[0].athlete,
    };
    const { "4065733": _tyJerome, ...athletesWithoutTyJerome } = leaderAthletes;
    respondWithEspn({
      leaders: withRepeatedLeader,
      athletes: athletesWithoutTyJerome,
    });

    const categories = await fetchLeaders();

    expect(
      categories.map(({ stat, leaders }) => [stat, leaders?.length ?? null]),
    ).toEqual([
      ["points", null],
      ["rebounds", 5],
      ["assists", null],
    ]);
  });

  it("fails the category of a leader that refers to a resource outside ESPN's NBA API", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const withForeignRef = structuredClone(regularSeasonLeaders);
    withForeignRef.categories[0].leaders[0].athlete.$ref =
      "https://example.com/v2/sports/basketball/leagues/nba/seasons/2027/athletes/1";
    respondWithEspn({ leaders: withForeignRef });

    const [points] = await fetchLeaders();

    expect(points.leaders).toBeNull();
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("example.com"),
      expect.anything(),
    );
  });
});
