import { fetchSeasonCalendar } from "@/app/lib/espn";
import noGames from "./__fixtures__/scoreboard-no-games.json";

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

describe("fetchSeasonCalendar", () => {
  it("reads the season from the scoreboard of its first day", async () => {
    respondWith(noGames);

    await fetchSeasonCalendar(2026);

    expect(fetchMock.mock.calls[0][0]).toContain("dates=20261001");
  });

  it("lists the season's game days as NBA dates, in order", async () => {
    respondWith({
      ...noGames,
      leagues: [
        {
          calendar: [
            "2026-10-22T07:00Z",
            "2026-10-20T07:00Z",
            "2026-10-22T07:00Z",
          ],
        },
      ],
    });

    expect(await fetchSeasonCalendar(2026)).toEqual([
      "2026-10-20",
      "2026-10-22",
    ]);
  });

  it("throws instead of reporting a season without games when ESPN sends no calendar", async () => {
    respondWith({ ...noGames, leagues: [] });

    await expect(fetchSeasonCalendar(2026)).rejects.toThrow(/calendar/);
  });
});
