import { fetchTeamRoster } from "@/app/lib/espn";
import lakersRoster from "./__fixtures__/team-roster-lakers.json";

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

describe("fetchTeamRoster", () => {
  it("requests the team roster directly from ESPN", async () => {
    respondWith(lakersRoster);

    await fetchTeamRoster("13");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13/roster",
      expect.anything(),
    );
  });

  it("maps every player on the roster", async () => {
    respondWith(lakersRoster);

    const players = await fetchTeamRoster("13");

    expect(players).toHaveLength(18);
    expect(players[1]).toEqual({
      id: "3945274",
      displayName: "Luka Doncic",
      jersey: "77",
      position: "G",
      height: `6' 8"`,
      weight: "230 lbs",
      age: 27,
      headshotUrl:
        "https://a.espncdn.com/i/headshots/nba/players/full/3945274.png",
    });
  });

  it("maps missing player details to null", async () => {
    respondWith({ athletes: [{ id: "1", displayName: "Unknown Player" }] });

    expect(await fetchTeamRoster("13")).toEqual([
      {
        id: "1",
        displayName: "Unknown Player",
        jersey: null,
        position: null,
        height: null,
        weight: null,
        age: null,
        headshotUrl: null,
      },
    ]);
  });

  it("throws instead of reporting an empty roster when the response has no athletes list", async () => {
    respondWith({ team: {} });

    await expect(fetchTeamRoster("13")).rejects.toThrow();
  });
});
