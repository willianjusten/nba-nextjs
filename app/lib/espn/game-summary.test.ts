import { fetchGameSummary } from "@/app/lib/espn";
import finalSummary from "./__fixtures__/summary-final.json";
import liveSummary from "./__fixtures__/summary-live.json";
import preGameSummary from "./__fixtures__/summary-pre-game.json";

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

describe("fetchGameSummary", () => {
  it("requests the ESPN game summary directly", async () => {
    respondWith(finalSummary);

    await fetchGameSummary("401909092");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=401909092",
      expect.anything(),
    );
  });

  describe("final game", () => {
    it("maps the game with final scores, status, and broadcasts", async () => {
      respondWith(finalSummary);

      const { game } = await fetchGameSummary("401909092");

      expect(game).toEqual({
        id: "401909092",
        startTime: "2026-10-22T02:00Z",
        nbaDate: "2026-10-21",
        seasonYear: 2027,
        seasonType: "regular",
        status: { kind: "final", period: 4 },
        venue: "crypto.com Arena",
        home: {
          team: {
            id: "13",
            abbreviation: "LAL",
            name: "Lakers",
            displayName: "Los Angeles Lakers",
            location: "Los Angeles",
            color: "552583",
            alternateColor: "fdb927",
            logoUrl:
              "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/lal.png",
          },
          score: 127,
          winner: true,
          record: "1-0",
        },
        away: {
          team: {
            id: "9",
            abbreviation: "GS",
            name: "Warriors",
            displayName: "Golden State Warriors",
            location: "Golden State",
            color: "fdb927",
            alternateColor: "1d428a",
            logoUrl:
              "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/gs.png",
          },
          score: 105,
          winner: false,
          record: "0-1",
        },
        broadcasts: [{ name: "ESPN", market: "national" }],
        series: null,
      });
    });

    it("maps the line score per period", async () => {
      respondWith(finalSummary);

      const { lineScore } = await fetchGameSummary("401909092");

      expect(lineScore).toEqual({
        home: [34, 32, 36, 25],
        away: [33, 19, 16, 37],
      });
    });

    it("maps each team's box score to its side", async () => {
      respondWith(finalSummary);

      const { boxScore } = await fetchGameSummary("401909092");

      expect(boxScore.away.players).toHaveLength(13);
      expect(boxScore.away.players[0]).toEqual({
        athlete: {
          id: "6589",
          displayName: "Draymond Green",
          shortName: "D. Green",
          jersey: "23",
          position: "F",
          headshotUrl:
            "https://a.espncdn.com/i/headshots/nba/players/full/6589.png",
        },
        starter: true,
        stats: {
          minutes: "21",
          points: "2",
          fieldGoals: "1-4",
          threePointers: "0-1",
          freeThrows: "0-0",
          rebounds: "4",
          assists: "8",
          turnovers: "4",
          steals: "1",
          blocks: "1",
          offensiveRebounds: "0",
          defensiveRebounds: "4",
          fouls: "3",
          plusMinus: "-22",
        },
        didNotPlayReason: null,
      });
      expect(boxScore.home.players[0].athlete.displayName).toBe(
        "Ziaire Williams",
      );
      expect(boxScore.home.totals).toMatchObject({
        minutes: "",
        points: "127",
        fieldGoals: "46-81",
        plusMinus: "",
      });
    });

    it("keeps players who did not play without stats", async () => {
      respondWith(finalSummary);

      const { boxScore } = await fetchGameSummary("401909092");
      const didNotPlay = boxScore.home.players.find(
        (player) => player.athlete.displayName === "Jarred Vanderbilt",
      );

      expect(didNotPlay).toMatchObject({
        stats: null,
        didNotPlayReason: "COACH'S DECISION",
      });
    });

    it("maps each team's points, rebounds, and assists leaders", async () => {
      respondWith(finalSummary);

      const { leaders } = await fetchGameSummary("401909092");

      expect(leaders.home.map(({ stat }) => stat)).toEqual([
        "points",
        "assists",
        "rebounds",
      ]);
      expect(leaders.home[0].leader).toEqual({
        athlete: {
          id: "3945274",
          displayName: "Luka Doncic",
          headshotUrl:
            "https://a.espncdn.com/i/headshots/nba/players/full/3945274.png",
        },
        value: 28,
        displayValue: "28",
      });
      expect(leaders.away[0].leader.displayValue).toBe("23");
    });

    it("maps the plays in game order", async () => {
      respondWith(finalSummary);

      const { plays } = await fetchGameSummary("401909092");

      expect(plays).toHaveLength(50);
      expect(plays[5]).toEqual({
        id: "40190909214",
        period: 1,
        clock: "11:06",
        text: "Draymond Green defensive rebound",
        teamId: "9",
        homeScore: 2,
        awayScore: 2,
        scoringPlay: false,
        scoreValue: 0,
        shootingPlay: false,
        coordinate: { x: 37, y: 25 },
      });
      expect(plays.at(-1)).toMatchObject({ text: "End of Game", teamId: null });
    });

    it("discards court coordinates with ESPN's sentinel value", async () => {
      respondWith(finalSummary);

      const { plays } = await fetchGameSummary("401909092");

      expect(plays[0].text).toBe(
        "Draymond Green vs. Walker Kessler (Luka Doncic gains possession)",
      );
      expect(plays[0].coordinate).toBeNull();
      expect(
        plays.filter(({ coordinate }) => coordinate === null),
      ).toHaveLength(10);
      expect(JSON.stringify(plays)).not.toMatch(/-21474\d{4}/);
    });

    it("maps the win probability points", async () => {
      respondWith(finalSummary);

      const { winProbability } = await fetchGameSummary("401909092");

      expect(winProbability).toHaveLength(50);
      expect(winProbability[0]).toEqual({
        playId: "4019090924",
        homeWinPercentage: 0.781,
      });
      expect(winProbability.at(-1)).toEqual({
        playId: "401909092766",
        homeWinPercentage: 1,
      });
    });

    it("leaves no ESPN internal .pvt links in the summary", async () => {
      respondWith(finalSummary);

      const summary = await fetchGameSummary("401909092");

      expect(JSON.stringify(finalSummary)).toContain("espn.pvt");
      expect(JSON.stringify(summary)).not.toContain("espn.pvt");
    });
  });

  describe("live game", () => {
    it("maps the period, clock, and current scores", async () => {
      respondWith(liveSummary);

      const { game } = await fetchGameSummary("401909093");

      expect(game).toMatchObject({
        id: "401909093",
        status: { kind: "live", period: 1, clock: "6:44" },
        home: { team: { abbreviation: "PHI" }, score: 9, winner: false },
        away: { team: { abbreviation: "CLE" }, score: 11, winner: false },
        broadcasts: [{ name: "ESPN", market: "national" }],
      });
    });

    it("maps the box score, leaders, plays, and win probability so far", async () => {
      respondWith(liveSummary);

      const summary = await fetchGameSummary("401909093");

      expect(summary.boxScore.away.players[0]).toMatchObject({
        athlete: { displayName: "Jarrett Allen" },
        stats: { minutes: "5", points: "6", fieldGoals: "3-3" },
      });
      expect(summary.boxScore.home.players).toHaveLength(13);
      expect(summary.leaders.away[0]).toMatchObject({
        stat: "points",
        leader: { displayValue: "6" },
      });
      expect(summary.plays).toHaveLength(40);
      expect(summary.plays.at(-1)).toMatchObject({
        text: "Joel Embiid defensive rebound",
        clock: "6:53",
        teamId: "20",
        coordinate: { x: 48, y: 15 },
      });
      expect(
        summary.plays.filter(({ coordinate }) => coordinate === null),
      ).toHaveLength(8);
      expect(summary.winProbability.at(-1)).toEqual({
        playId: "40190909360",
        homeWinPercentage: 0.674,
      });
    });
  });

  describe("pre-game", () => {
    it("maps a scheduled game without scores, plays, or win probability", async () => {
      respondWith(preGameSummary);

      const summary = await fetchGameSummary("401909094");

      expect(summary.game).toMatchObject({
        id: "401909094",
        startTime: "2026-10-23T01:30Z",
        nbaDate: "2026-10-22",
        status: { kind: "scheduled" },
        home: { score: 0, winner: false },
        away: { score: 0, winner: false },
      });
      expect(summary.lineScore).toEqual({ home: [], away: [] });
      expect(summary.boxScore).toEqual({
        home: { players: [], totals: null },
        away: { players: [], totals: null },
      });
      expect(summary.plays).toEqual([]);
      expect(summary.winProbability).toEqual([]);
    });

    it("maps season average leaders, and none for a team without them", async () => {
      respondWith(preGameSummary);

      const { leaders } = await fetchGameSummary("401909094");

      expect(leaders.home.map(({ stat }) => stat)).toEqual([
        "points",
        "assists",
        "rebounds",
      ]);
      expect(leaders.home[0].leader.displayValue).toBe("32.0");
      expect(leaders.away).toEqual([]);
    });
  });

  describe("broadcasts", () => {
    it("falls back to NBA League Pass when the summary lists no broadcast", async () => {
      const noBroadcasts = structuredClone(preGameSummary);
      noBroadcasts.header.competitions[0].broadcasts = [];
      respondWith(noBroadcasts);

      const { game } = await fetchGameSummary("401909094");

      expect(game.broadcasts).toEqual([
        { name: "NBA League Pass", market: "national" },
      ]);
    });
  });

  it("throws when ESPN responds with an error", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 404 }));

    await expect(fetchGameSummary("1")).rejects.toThrow();
  });
});
