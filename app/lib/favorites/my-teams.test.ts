import type { ListedTeam } from "@/app/lib/domain/team";
import teamsList from "@/app/lib/espn/__fixtures__/teams-list.json";
import { mapListedTeam } from "@/app/lib/espn/mappers";
import type { RawTeamsList } from "@/app/lib/espn/raw-types";
import { buildTeamPicker, myTeamsOf } from "./my-teams";

const teams: ListedTeam[] = (
  teamsList as RawTeamsList
).sports[0].leagues[0].teams.map(({ team }) => mapListedTeam(team));

describe("myTeamsOf", () => {
  it("lists the favorite teams in the order they were followed, linking to their pages", () => {
    expect(myTeamsOf(["13", "18"], teams)).toEqual([
      {
        teamId: "13",
        name: "Lakers",
        displayName: "Los Angeles Lakers",
        logoUrl: expect.stringContaining("lal.png"),
        href: "/teams/lakers",
      },
      {
        teamId: "18",
        name: "Knicks",
        displayName: "New York Knicks",
        logoUrl: expect.stringContaining("ny.png"),
        href: "/teams/knicks",
      },
    ]);
  });

  it("leaves out favorite ids that match no team", () => {
    expect(
      myTeamsOf(["unknown", "13"], teams)?.map((team) => team.teamId),
    ).toEqual(["13"]);
  });

  it("lists no teams without favorites, even before the teams list loads", () => {
    expect(myTeamsOf([], teams)).toEqual([]);
    expect(myTeamsOf([], null)).toEqual([]);
  });

  it("holds the favorite teams back while the teams list is pending", () => {
    expect(myTeamsOf(["13"], null)).toBeNull();
  });
});

describe("buildTeamPicker", () => {
  it("offers every team in alphabetical order", () => {
    const options = buildTeamPicker(teams, []);

    expect(options).toHaveLength(teams.length);
    expect(options[0].displayName).toBe("Atlanta Hawks");
    expect(options.at(-1)?.displayName).toBe("Washington Wizards");
  });

  it("marks the followed teams, naming the action for screen readers", () => {
    const options = buildTeamPicker(teams, ["13"]);
    const lakers = options.find((option) => option.teamId === "13");
    const knicks = options.find((option) => option.teamId === "18");

    expect(lakers).toMatchObject({
      isFavorite: true,
      label: "Follow Los Angeles Lakers",
    });
    expect(knicks).toMatchObject({
      isFavorite: false,
      label: "Follow New York Knicks",
    });
  });
});
