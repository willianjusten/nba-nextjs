import { fetchScoreboard } from "@/app/lib/espn";
import { parseNbaDate } from "@/app/lib/time/nba-date";
import noGames from "./__fixtures__/scoreboard-no-games.json";
import playoffGame from "./__fixtures__/scoreboard-playoff-game.json";
import { espnGet } from "./transport";

vi.mock("./config", async (importOriginal) => {
  const original = await importOriginal<typeof import("./config")>();
  return {
    ...original,
    ESPN_ENDPOINTS: {
      ...original.ESPN_ENDPOINTS,
      scoreboard: { ...original.ESPN_ENDPOINTS.scoreboard, access: "proxy" },
    },
  };
});

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ESPN transport", () => {
  it("routes a proxied endpoint through the app's route handler in the browser", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(noGames)));

    await fetchScoreboard(parseNbaDate("2026-08-01")!);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/espn/site/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260801",
      expect.anything(),
    );
  });

  it("rewrites private core API hosts to the public host", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(playoffGame)));

    const rawText = JSON.stringify(await espnGet("scoreboard"));

    expect(rawText).not.toContain("sports.core.api.espn.pvt");
    expect(rawText).toContain(
      "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons/2026/teams/18",
    );
  });
});
