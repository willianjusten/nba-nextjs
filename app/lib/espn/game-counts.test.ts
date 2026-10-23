import { fetchGameCounts } from "@/app/lib/espn";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import headerWeek from "./__fixtures__/scoreboard-header-week.json";

const fetchMock = vi.fn();
const firstDate = "2026-10-17" as NbaDate;
const lastDate = "2026-10-23" as NbaDate;

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

describe("fetchGameCounts", () => {
  it("requests the ESPN scoreboard header for the whole range in one call", async () => {
    respondWith(headerWeek);

    await fetchGameCounts(firstDate, lastDate);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=nba&dates=20261017-20261023",
      expect.anything(),
    );
  });

  it("counts games per NBA date, placing late tip-offs on their Eastern day", async () => {
    respondWith(headerWeek);

    const gameCounts = await fetchGameCounts(firstDate, lastDate);

    expect(gameCounts).toEqual({
      "2026-10-17": 0,
      "2026-10-18": 0,
      "2026-10-19": 0,
      "2026-10-20": 3,
      "2026-10-21": 11,
      "2026-10-22": 2,
      "2026-10-23": 12,
    });
  });

  it("counts zero games on every day when ESPN lists no events for the range", async () => {
    const [sport] = headerWeek.sports;
    const [league] = sport.leagues;
    const { events: _events, ...leagueWithoutEvents } = league;
    respondWith({ sports: [{ ...sport, leagues: [leagueWithoutEvents] }] });

    const gameCounts = await fetchGameCounts(firstDate, lastDate);

    expect(Object.values(gameCounts)).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it("fails instead of reporting empty days when ESPN sends no league", async () => {
    respondWith({ sports: [] });

    await expect(fetchGameCounts(firstDate, lastDate)).rejects.toThrow();
  });
});
