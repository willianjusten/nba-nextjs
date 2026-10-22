import { fetchStandings } from "@/app/lib/espn";
import regularSeasonStandings from "./__fixtures__/standings-regular-season.json";

const fetchMock = vi.fn();

function respondWith(body: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status: 200 }),
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-22T18:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("fetchStandings", () => {
  it.each([
    ["preseason", "2026-10-05T18:00:00Z"],
    ["regular season", "2026-10-22T18:00:00Z"],
    ["postseason", "2027-05-01T18:00:00Z"],
  ])(
    "requests the regular season standings directly from ESPN during the %s",
    async (_phase, now) => {
      vi.setSystemTime(new Date(now));
      respondWith(regularSeasonStandings);

      await fetchStandings();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?seasontype=2",
        expect.anything(),
      );
    },
  );

  it("maps both conferences with every team", async () => {
    respondWith(regularSeasonStandings);

    const { conferences } = await fetchStandings();

    expect(
      conferences.map((conference) => [
        conference.name,
        conference.abbreviation,
        conference.rows.length,
      ]),
    ).toEqual([
      ["Eastern Conference", "East", 15],
      ["Western Conference", "West", 15],
    ]);
  });

  it("orders each conference by playoff seed", async () => {
    respondWith(regularSeasonStandings);

    const {
      conferences: [east],
    } = await fetchStandings();

    expect(east.rows.map((row) => [row.team.abbreviation, row.seed])).toEqual([
      ["IND", 1],
      ["TOR", 2],
      ["WSH", 3],
      ["DET", 4],
      ["ATL", 5],
      ["CHA", 6],
      ["PHI", 7],
      ["CLE", 8],
      ["BKN", 9],
      ["NY", 9],
      ["ORL", 9],
      ["BOS", 12],
      ["MIL", 13],
      ["MIA", 14],
      ["CHI", 15],
    ]);
  });

  it("maps a standings row", async () => {
    respondWith(regularSeasonStandings);

    const {
      conferences: [east],
    } = await fetchStandings();

    expect(east.rows[0]).toEqual({
      team: {
        id: "11",
        abbreviation: "IND",
        name: "Pacers",
        displayName: "Indiana Pacers",
        location: "Indiana",
        color: null,
        logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/ind.png",
        slug: "pacers",
      },
      seed: 1,
      wins: 1,
      losses: 0,
      winPercent: 1,
      gamesBehind: 0,
      homeRecord: "0-0",
      roadRecord: "1-0",
      lastTenRecord: "1-0",
      streak: "W1",
    });
  });

  it("maps a team that has not played yet", async () => {
    respondWith(regularSeasonStandings);

    const {
      conferences: [east],
    } = await fetchStandings();
    const cavaliers = east.rows.find((row) => row.team.abbreviation === "CLE");

    expect(cavaliers).toMatchObject({
      wins: 0,
      losses: 0,
      gamesBehind: 0.5,
      lastTenRecord: "0-0",
      streak: null,
    });
  });

  it("derives the current season from the response", async () => {
    respondWith(regularSeasonStandings);

    const { season } = await fetchStandings();

    expect(season).toEqual({
      year: 2027,
      displayName: "2026-27",
      currentPhase: "regular",
    });
  });

  it.each([
    ["2026-10-05T18:00:00Z", "preseason"],
    ["2026-10-20T07:00:00Z", "regular"],
    ["2027-04-14T18:00:00Z", "play-in"],
    ["2027-05-01T18:00:00Z", "postseason"],
    ["2027-07-15T18:00:00Z", "offseason"],
  ])(
    "derives the season phase at %s from the season calendar as %s",
    async (now, expectedPhase) => {
      vi.setSystemTime(new Date(now));
      respondWith(regularSeasonStandings);

      const { season } = await fetchStandings();

      expect(season.currentPhase).toBe(expectedPhase);
    },
  );

  it("throws instead of showing a zero when a team is missing a stat", async () => {
    const withoutSeed = structuredClone(regularSeasonStandings);
    const [firstEntry] = withoutSeed.children[0].standings.entries;
    firstEntry.stats = firstEntry.stats.filter(
      (stat) => stat.name !== "playoffSeed",
    );
    respondWith(withoutSeed);

    await expect(fetchStandings()).rejects.toThrow(/playoffSeed/);
  });

  it("throws instead of reporting the offseason when the season calendar is missing", async () => {
    respondWith({ ...regularSeasonStandings, seasons: [] });

    await expect(fetchStandings()).rejects.toThrow(/calendar/);
  });

  it("throws instead of reporting empty standings when the response has no conferences", async () => {
    respondWith({ season: regularSeasonStandings.season });

    await expect(fetchStandings()).rejects.toThrow();
  });
});
