import { GET } from "./route";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const FIVE_MINUTES_IN_SECONDS = 5 * 60;
const fetchMock = vi.fn();

function callRoute(host: string, path: string[], search = "") {
  const request = new Request(
    `http://localhost/api/espn/${host}/${path.join("/")}${search}`,
  );
  return GET(request, { params: Promise.resolve({ host, path }) });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ESPN proxy route", () => {
  it("forwards the request to ESPN and returns its JSON", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('{"events":[]}', {
        status: 200,
        headers: { "cache-control": "max-age=9" },
      }),
    );

    const response = await callRoute(
      "site",
      ["apis", "site", "v2", "sports", "basketball", "nba", "scoreboard"],
      "?dates=20261022",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20261022",
      expect.anything(),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("max-age=9");
    expect(await response.json()).toEqual({ events: [] });
  });

  it("revalidates a team detail once a day", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await callRoute("site", [
      "apis",
      "site",
      "v2",
      "sports",
      "basketball",
      "nba",
      "teams",
      "13",
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13",
      expect.objectContaining({ next: { revalidate: ONE_DAY_IN_SECONDS } }),
    );
  });

  it("revalidates a team schedule every 5 minutes instead of inheriting the team detail cache", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await callRoute("site", [
      "apis",
      "site",
      "v2",
      "sports",
      "basketball",
      "nba",
      "teams",
      "13",
      "schedule",
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13/schedule",
      expect.objectContaining({
        next: { revalidate: FIVE_MINUTES_IN_SECONDS },
      }),
    );
  });

  it("does not give paths below a team resource the team detail cache", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await callRoute("site", [
      "apis",
      "site",
      "v2",
      "sports",
      "basketball",
      "nba",
      "teams",
      "13",
      "roster",
    ]);

    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty("next");
  });

  it("does not cache endpoints without a revalidation period", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await callRoute("site", [
      "apis",
      "site",
      "v2",
      "sports",
      "basketball",
      "nba",
      "scoreboard",
    ]);

    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty("next");
  });

  it("passes ESPN error statuses through", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 }));

    const response = await callRoute("site", [
      "apis",
      "site",
      "v2",
      "sports",
      "basketball",
      "nba",
      "scoreboard",
    ]);

    expect(response.status).toBe(503);
  });

  it.each([
    [
      "an unknown host",
      "example",
      ["apis", "site", "v2", "sports", "basketball", "nba"],
    ],
    [
      "a path outside the NBA API",
      "site",
      ["apis", "site", "v2", "sports", "football", "nfl", "scoreboard"],
    ],
    [
      "a path that escapes the prefix",
      "site",
      [
        "apis",
        "site",
        "v2",
        "sports",
        "basketball",
        "nba",
        "..",
        "..",
        "football",
      ],
    ],
  ])("rejects %s without calling ESPN", async (_case, host, path) => {
    const response = await callRoute(host, path);

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
