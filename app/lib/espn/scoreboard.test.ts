import { fetchScoreboard } from "@/app/lib/espn";
import { parseNbaDate } from "@/app/lib/time/nba-date";
import finalDay from "./__fixtures__/scoreboard-final-day.json";
import scheduledDay from "./__fixtures__/scoreboard-scheduled-day.json";
import noGames from "./__fixtures__/scoreboard-no-games.json";
import playoffGame from "./__fixtures__/scoreboard-playoff-game.json";
import playInGame from "./__fixtures__/scoreboard-play-in.json";

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
      home: {
        team: {
          id: "19",
          abbreviation: "ORL",
          name: "Magic",
          displayName: "Orlando Magic",
          location: "Orlando",
          color: "0150b5",
          logoUrl:
            "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/orl.png",
        },
        score: 125,
        winner: false,
      },
      away: {
        team: {
          id: "1",
          abbreviation: "ATL",
          name: "Hawks",
          displayName: "Atlanta Hawks",
          location: "Atlanta",
          color: "c8102e",
          logoUrl:
            "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/atl.png",
        },
        score: 132,
        winner: true,
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

  it("returns an empty list on a day without games", async () => {
    respondWith(noGames);

    const scoreboard = await fetchScoreboard(parseNbaDate("2026-08-01")!);

    expect(scoreboard).toEqual({ nbaDate: "2026-08-01", games: [] });
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

  it("throws when ESPN responds with an error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));

    await expect(
      fetchScoreboard(parseNbaDate("2026-10-21")!),
    ).rejects.toThrow();
  });
});
