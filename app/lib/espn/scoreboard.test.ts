import { fetchScoreboard } from "@/app/lib/espn";
import { parseNbaDate } from "@/app/lib/time/nba-date";
import finalDay from "./__fixtures__/scoreboard-final-day.json";
import scheduledDay from "./__fixtures__/scoreboard-scheduled-day.json";
import noGames from "./__fixtures__/scoreboard-no-games.json";
import playoffGame from "./__fixtures__/scoreboard-playoff-game.json";
import playInGame from "./__fixtures__/scoreboard-play-in.json";
import liveDay from "./__fixtures__/scoreboard-live-day-simulated.json";
import endOfPeriod from "./__fixtures__/scoreboard-end-of-period-simulated.json";
import preseasonDay from "./__fixtures__/scoreboard-preseason-day.json";
import internationalExhibition from "./__fixtures__/scoreboard-international-exhibition.json";

const fetchMock = vi.fn();

function respondWith(body: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status: 200 }),
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchScoreboard", () => {
  it("requests the ESPN scoreboard for the NBA date", async () => {
    respondWith(finalDay);

    await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20261021",
      expect.anything(),
    );
  });

  it("maps a final game with numeric scores and the winner", async () => {
    respondWith(finalDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.nbaDate).toBe("2026-10-21");
    expect(scoreboard.games).toHaveLength(3);
    expect(scoreboard.games[0]).toEqual({
      id: "401909834",
      startTime: "2026-10-21T23:00Z",
      nbaDate: "2026-10-21",
      seasonYear: 2027,
      seasonType: "regular",
      status: { kind: "final", period: 4 },
      venue: "Kia Center",
      home: {
        team: {
          id: "19",
          abbreviation: "ORL",
          name: "Magic",
          displayName: "Orlando Magic",
          location: "Orlando",
          color: "0150b5",
          alternateColor: "9ca0a3",
          logoUrl:
            "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/orl.png",
        },
        score: 125,
        winner: false,
        record: "0-1",
      },
      away: {
        team: {
          id: "1",
          abbreviation: "ATL",
          name: "Hawks",
          displayName: "Atlanta Hawks",
          location: "Atlanta",
          color: "c8102e",
          alternateColor: "fdb927",
          logoUrl:
            "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/atl.png",
        },
        score: 132,
        winner: true,
        record: "1-0",
      },
      broadcasts: [{ name: "NBA League Pass", market: "away" }],
      series: null,
      homeWinProbability: null,
      topScorer: {
        shortName: "P. Banchero",
        points: 35,
        statLine: "35 PTS, 7 REB, 10 AST",
      },
    });
  });

  it("maps scheduled games and keeps a late Eastern game on its NBA date", async () => {
    respondWith(scheduledDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);
    const lateGame = scoreboard.games[1];

    expect(lateGame.status).toEqual({ kind: "scheduled" });
    expect(lateGame.startTime).toBe("2026-10-23T01:30Z");
    expect(lateGame.nbaDate).toBe("2026-10-22");
    expect(lateGame.home.score).toBe(0);
  });

  it("maps a live game with period, clock, and current scores", async () => {
    respondWith(liveDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);
    const liveGame = scoreboard.games[0];

    expect(liveGame.status).toEqual({ kind: "live", period: 2, clock: "7:11" });
    expect(liveGame.home.score).toBe(52);
    expect(liveGame.away.score).toBe(48);
  });

  it("maps a game at halftime", async () => {
    respondWith(liveDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);

    expect(scoreboard.games[1].status).toEqual({ kind: "halftime", period: 2 });
  });

  it("keeps a game between quarters live", async () => {
    respondWith(endOfPeriod);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);

    expect(scoreboard.games[0].status).toEqual({
      kind: "live",
      period: 1,
      clock: "0.0",
    });
  });

  it("returns an empty list on a day without games", async () => {
    respondWith(noGames);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-08-01")!);

    expect(scoreboard.games).toEqual([]);
  });

  it("reads the season type from the event, not the league header", async () => {
    respondWith(playoffGame);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-06-10")!);

    expect(scoreboard.games[0].seasonType).toBe("postseason");
    expect(scoreboard.games[0].seasonYear).toBe(2026);
  });

  it("recognizes play-in games", async () => {
    respondWith(playInGame);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-04-15")!);

    expect(scoreboard.games[0].seasonType).toBe("play-in");
  });

  it("removes duplicates between broadcasts and geo broadcasts", async () => {
    respondWith(finalDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[2].broadcasts).toEqual([
      { name: "ESPN", market: "national" },
    ]);
  });

  it("adds a channel listed only in geo broadcasts, national first", async () => {
    const geoOnly = structuredClone(finalDay);
    geoOnly.events[0].competitions[0].geoBroadcasts = structuredClone(
      finalDay.events[2].competitions[0].geoBroadcasts,
    );
    respondWith(geoOnly);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[0].broadcasts).toEqual([
      { name: "ESPN", market: "national" },
      { name: "NBA League Pass", market: "away" },
    ]);
  });

  it("keeps Prime Video broadcasts", async () => {
    respondWith(playInGame);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-04-15")!);

    expect(scoreboard.games[0].broadcasts).toEqual([
      { name: "Prime Video", market: "national" },
    ]);
  });

  it("leaves out channels other than ESPN, Prime Video, and NBA League Pass", async () => {
    respondWith(finalDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[1].broadcasts).toEqual([
      { name: "NBA League Pass", market: "away" },
    ]);
  });

  it("falls back to NBA League Pass when no supported channel is listed", async () => {
    respondWith(preseasonDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-15")!);
    const leaguePassOnly = [{ name: "NBA League Pass", market: "national" }];

    expect(scoreboard.games[0].broadcasts).toEqual(leaguePassOnly);
    expect(scoreboard.games[1].broadcasts).toEqual(leaguePassOnly);
  });

  it("maps the home team's chance to win as of the last play", async () => {
    const withProbability = structuredClone(liveDay);
    Object.assign(withProbability.events[0].competitions[0], {
      situation: {
        lastPlay: {
          probability: {
            homeWinPercentage: 0.68,
            awayWinPercentage: 0.32,
            tiePercentage: 0,
          },
        },
      },
    });
    respondWith(withProbability);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);

    expect(scoreboard.games[0].homeWinProbability).toBe(0.68);
  });

  it("has no win probability when ESPN sends no situation", async () => {
    respondWith(liveDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);

    expect(scoreboard.games[0].homeWinProbability).toBeNull();
  });

  it("picks the top scorer across both teams with ESPN's stat line", async () => {
    respondWith(finalDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[0].topScorer).toEqual({
      shortName: "P. Banchero",
      points: 35,
      statLine: "35 PTS, 7 REB, 10 AST",
    });
    expect(scoreboard.games[2].topScorer).toMatchObject({
      shortName: "A. Edwards",
      points: 45,
    });
  });

  it("leaves the stat line out when ESPN rates another player higher", async () => {
    const otherRatingLeader = structuredClone(finalDay);
    const homeLeaders =
      otherRatingLeader.events[0].competitions[0].competitors[0].leaders;
    const ratingCategory = homeLeaders.find(
      (category) => category.name === "rating",
    )!;
    ratingCategory.leaders[0].athlete.id = "another-athlete";
    respondWith(otherRatingLeader);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[0].topScorer).toMatchObject({
      shortName: "P. Banchero",
      points: 35,
      statLine: null,
    });
  });

  it("has no top scorer before tip-off, when ESPN lists season averages", async () => {
    respondWith(scheduledDay);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-22")!);

    expect(scoreboard.games[0].topScorer).toBeNull();
  });

  it("has no top scorer when ESPN sends no leaders", async () => {
    const withoutLeaders = structuredClone(finalDay);
    for (const competitor of withoutLeaders.events[0].competitions[0]
      .competitors) {
      Reflect.deleteProperty(competitor, "leaders");
    }
    respondWith(withoutLeaders);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-21")!);

    expect(scoreboard.games[0].topScorer).toBeNull();
  });

  it("maps a team without an ESPN logo to no logo", async () => {
    respondWith(internationalExhibition);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-12")!);

    expect(scoreboard.games[0].away.team.displayName).toBe("London Lions");
    expect(scoreboard.games[0].away.team.logoUrl).toBeNull();
    expect(scoreboard.games[0].home.team.logoUrl).toBe(
      "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/por.png",
    );
  });

  it("maps a team without colors or a record to null", async () => {
    respondWith(internationalExhibition);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-10-12")!);
    const { away } = scoreboard.games[0];

    expect(away.team.color).toBeNull();
    expect(away.team.alternateColor).toBeNull();
    expect(away.record).toBeNull();
  });

  it("exposes the series of a playoff game by side", async () => {
    respondWith(playoffGame);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-06-10")!);

    expect(scoreboard.games[0].series).toEqual({
      summary: "NY leads series 3-1",
      completed: false,
      totalGames: 7,
      homeWins: 3,
      awayWins: 1,
    });
  });

  it("ignores a series that is not a playoff series", async () => {
    const seasonSeries = structuredClone(playoffGame);
    seasonSeries.events[0].competitions[0].series.type = "season";
    respondWith(seasonSeries);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-06-10")!);

    expect(scoreboard.games[0].series).toBeNull();
  });

  it("has no series outside the playoffs", async () => {
    respondWith(playInGame);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-04-15")!);

    expect(scoreboard.games[0].series).toBeNull();
  });

  it("throws instead of reporting an empty day when the response has no events list", async () => {
    respondWith({ leagues: [] });

    await expect(
      fetchScoreboard(parseNbaDate("2026-10-21")!),
    ).rejects.toThrow();
  });

  it("throws instead of reporting a game as scheduled when its state is unknown", async () => {
    const unknownState = structuredClone(scheduledDay);
    unknownState.events[0].status.type.state = "unexpected";
    respondWith(unknownState);

    await expect(
      fetchScoreboard(parseNbaDate("2026-10-22")!),
    ).rejects.toThrow();
  });

  it("throws when ESPN responds with an error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));

    await expect(
      fetchScoreboard(parseNbaDate("2026-10-21")!),
    ).rejects.toThrow();
  });
});
