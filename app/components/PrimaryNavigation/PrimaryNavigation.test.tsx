import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { strings } from "@/app/lib/strings";
import regularSeasonDay from "@/app/lib/espn/__fixtures__/scoreboard-final-day.json";
import playoffDay from "@/app/lib/espn/__fixtures__/scoreboard-playoff-game.json";
import PrimaryNavigation from ".";

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));

function respondWith(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  );
}

function primaryNavigation() {
  return screen.getByRole("navigation", {
    name: strings.shell.primaryNavigation,
  });
}

function bottomNavigation() {
  return screen.getByRole("navigation", {
    name: strings.shell.bottomNavigation,
  });
}

function sectionLabels(navigation: HTMLElement) {
  return within(navigation)
    .getAllByRole("link")
    .map((link) => link.textContent);
}

const { games, standings, playoffs } = strings.shell.sections;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("PrimaryNavigation", () => {
  it("shows Games and Standings in both navigations during the regular season", async () => {
    respondWith(regularSeasonDay);

    render(await PrimaryNavigation());

    expect(sectionLabels(primaryNavigation())).toEqual([games, standings]);
    expect(sectionLabels(bottomNavigation())).toEqual([games, standings]);
  });

  it("adds the Playoffs tab during the postseason", async () => {
    respondWith(playoffDay);

    render(await PrimaryNavigation());

    expect(sectionLabels(primaryNavigation())).toEqual([
      games,
      standings,
      playoffs,
    ]);
    expect(sectionLabels(bottomNavigation())).toEqual([
      games,
      standings,
      playoffs,
    ]);
  });

  it("adds the Playoffs tab when the env override forces it on", async () => {
    vi.stubEnv("FORCE_PLAYOFFS_TAB", "true");
    respondWith(regularSeasonDay);

    render(await PrimaryNavigation());

    expect(sectionLabels(primaryNavigation())).toContain(playoffs);
  });

  it("hides the Playoffs tab when the scoreboard fails to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    respondWith({}, 500);

    render(await PrimaryNavigation());

    expect(sectionLabels(primaryNavigation())).toEqual([games, standings]);
  });

  it("gives every bottom navigation tab a decorative icon beside its label", async () => {
    respondWith(playoffDay);

    render(await PrimaryNavigation());

    for (const link of within(bottomNavigation()).getAllByRole("link")) {
      expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
  });

  it("marks Games as the current section on a games date page", async () => {
    vi.mocked(usePathname).mockReturnValue("/games/2026-10-21");
    respondWith(regularSeasonDay);

    render(await PrimaryNavigation());

    expect(
      within(primaryNavigation())
        .getByRole("link", { name: games })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(
      within(primaryNavigation())
        .getByRole("link", { name: standings })
        .getAttribute("aria-current"),
    ).toBeNull();
  });

  it("marks Standings as the current section on the standings page", async () => {
    vi.mocked(usePathname).mockReturnValue("/standings");
    respondWith(regularSeasonDay);

    render(await PrimaryNavigation());

    expect(
      within(bottomNavigation())
        .getByRole("link", { name: standings })
        .getAttribute("aria-current"),
    ).toBe("page");
  });
});
