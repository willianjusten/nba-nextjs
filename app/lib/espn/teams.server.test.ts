// @vitest-environment node
import { fetchTeamDetail, fetchTeamSchedule, fetchTeams } from "@/app/lib/espn";
import teamsList from "./__fixtures__/teams-list.json";
import lakersDetail from "./__fixtures__/team-detail-lakers.json";
import lakersSchedule from "./__fixtures__/team-schedule-lakers.json";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const FIVE_MINUTES_IN_SECONDS = 5 * 60;
const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("teams on the server", () => {
  it("revalidates the teams list once a day", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(teamsList)));

    await fetchTeams();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams",
      expect.objectContaining({ next: { revalidate: ONE_DAY_IN_SECONDS } }),
    );
  });

  it("revalidates the team detail once a day", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(lakersDetail)));

    await fetchTeamDetail("13");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13",
      expect.objectContaining({ next: { revalidate: ONE_DAY_IN_SECONDS } }),
    );
  });

  it("revalidates the team schedule every 5 minutes", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(lakersSchedule)),
    );

    await fetchTeamSchedule("13");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/13/schedule",
      expect.objectContaining({
        next: { revalidate: FIVE_MINUTES_IN_SECONDS },
      }),
    );
  });
});
