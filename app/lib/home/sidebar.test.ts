import type { Leader, LeaderCategory } from "@/app/lib/domain/leaders";
import type { ConferenceStandings } from "@/app/lib/domain/standings";
import standingsFixture from "@/app/lib/espn/__fixtures__/standings-regular-season.json";
import { mapConferenceStandings } from "@/app/lib/espn/mappers";
import type { RawConferenceStandings } from "@/app/lib/espn/raw-types";
import { buildSidebarLeaders, buildSidebarStandings } from "./sidebar";

const conferences = (
  standingsFixture.children as unknown as RawConferenceStandings[]
).map(mapConferenceStandings);
const [east, west] = conferences as [ConferenceStandings, ConferenceStandings];
const eastTeamId = east.rows[7].team.id;
const westTeamId = west.rows[2].team.id;

function leaderNamed(name: string, displayValue: string): Leader {
  const [firstName, ...lastNames] = name.split(" ");
  return {
    athlete: {
      id: name,
      displayName: name,
      shortName: `${firstName[0]}. ${lastNames.join(" ")}`,
      headshotUrl: `https://a.espncdn.com/${name}.png`,
    },
    value: Number(displayValue),
    displayValue,
  };
}

const pointsLeaders = [
  leaderNamed("Shai Gilgeous-Alexander", "33.5"),
  leaderNamed("Luka Doncic", "31.8"),
  leaderNamed("Giannis Antetokounmpo", "30.2"),
  leaderNamed("Anthony Edwards", "28.9"),
];

describe("buildSidebarStandings", () => {
  it("shows the top 5 of the West when there are no favorites", () => {
    const sidebarStandings = buildSidebarStandings(conferences, []);

    expect(sidebarStandings?.conferenceAbbreviation).toBe("West");
    expect(sidebarStandings?.rows.map((row) => row.teamId)).toEqual(
      west.rows.slice(0, 5).map((row) => row.team.id),
    );
  });

  it("shows the first favorite team's conference", () => {
    const sidebarStandings = buildSidebarStandings(conferences, [
      eastTeamId,
      westTeamId,
    ]);

    expect(sidebarStandings?.conferenceAbbreviation).toBe("East");
  });

  it("skips favorites that are not in the standings", () => {
    const sidebarStandings = buildSidebarStandings(conferences, [
      "unknown",
      eastTeamId,
    ]);

    expect(sidebarStandings?.conferenceAbbreviation).toBe("East");
  });

  it("highlights every favorite team in the top 5", () => {
    const [first, second] = west.rows;

    const sidebarStandings = buildSidebarStandings(conferences, [
      second.team.id,
      first.team.id,
    ]);

    expect(sidebarStandings?.rows.map((row) => row.isFavorite)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it("links each team to its page and shows its seed, record, and streak", () => {
    const [firstRow] = west.rows;

    const [sidebarRow] = buildSidebarStandings(conferences, [])!.rows;

    expect(sidebarRow).toEqual({
      teamId: firstRow.team.id,
      seed: firstRow.seed,
      name: firstRow.team.name,
      logoUrl: firstRow.team.logoUrl,
      href: `/teams/${firstRow.team.slug}`,
      record: `${firstRow.wins}-${firstRow.losses}`,
      streak: firstRow.streak,
      streakKind: firstRow.streak?.startsWith("W") ? "win" : "loss",
      isFavorite: false,
    });
  });

  it.each([
    ["W3", "win"],
    ["L1", "loss"],
    [null, null],
  ] as const)("reads the %s streak as %s", (streak, streakKind) => {
    const westWithStreak: ConferenceStandings = {
      ...west,
      rows: west.rows.map((row) => ({ ...row, streak })),
    };

    const [sidebarRow] = buildSidebarStandings([westWithStreak], [])!.rows;

    expect(sidebarRow.streakKind).toBe(streakKind);
  });

  it("falls back to the first conference when there is no West", () => {
    expect(buildSidebarStandings([east], [])?.conferenceAbbreviation).toBe(
      "East",
    );
  });

  it("is null without conferences", () => {
    expect(buildSidebarStandings([], [])).toBeNull();
  });
});

describe("buildSidebarLeaders", () => {
  it("keeps each category's leader and the next two runners-up", () => {
    const categories: LeaderCategory[] = [
      { stat: "points", leaders: pointsLeaders },
    ];

    const [points] = buildSidebarLeaders(categories);

    expect(points).toEqual({
      status: "ready",
      stat: "points",
      leader: pointsLeaders[0],
      runnersUp: [
        { rank: 2, shortName: "L. Doncic", displayValue: "31.8" },
        { rank: 3, shortName: "G. Antetokounmpo", displayValue: "30.2" },
      ],
    });
  });

  it("keeps a category with fewer than three leaders", () => {
    const [points] = buildSidebarLeaders([
      { stat: "points", leaders: pointsLeaders.slice(0, 1) },
    ]);

    expect(points).toMatchObject({ status: "ready", runnersUp: [] });
  });

  it("marks categories without leaders as empty and failed ones as errors", () => {
    expect(
      buildSidebarLeaders([
        { stat: "rebounds", leaders: [] },
        { stat: "assists", leaders: null },
      ]),
    ).toEqual([
      { status: "empty", stat: "rebounds" },
      { status: "error", stat: "assists" },
    ]);
  });
});
