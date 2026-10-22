import { GET } from "./route";

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
