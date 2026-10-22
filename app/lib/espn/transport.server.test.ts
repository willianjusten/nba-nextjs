// @vitest-environment node
import { fetchScoreboard } from "@/app/lib/espn";
import { parseNbaDate } from "@/app/lib/time/nba-date";
import noGames from "./__fixtures__/scoreboard-no-games.json";

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

describe("ESPN transport on the server", () => {
  it("calls ESPN directly even when the endpoint is proxied for the browser", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(noGames)));

    await fetchScoreboard(parseNbaDate("2026-08-01")!);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260801",
      expect.anything(),
    );
  });
});
