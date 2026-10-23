import { strings } from "@/app/lib/strings";

export type NavigationSection = {
  id: "games" | "standings" | "playoffs";
  href: string;
  label: string;
  // Other path prefixes that belong to the section, so date pages keep Games highlighted.
  matchPrefixes: string[];
  // Shown only during part of the season, which the tab signals with a dashed outline.
  seasonal: boolean;
};

const GAMES: NavigationSection = {
  id: "games",
  href: "/",
  label: strings.shell.sections.games,
  matchPrefixes: ["/games/"],
  seasonal: false,
};

const STANDINGS: NavigationSection = {
  id: "standings",
  href: "/standings",
  label: strings.shell.sections.standings,
  matchPrefixes: [],
  seasonal: false,
};

const PLAYOFFS: NavigationSection = {
  id: "playoffs",
  href: "/playoffs",
  label: strings.shell.sections.playoffs,
  matchPrefixes: [],
  seasonal: true,
};

export function navigationSections(showPlayoffs: boolean) {
  return showPlayoffs ? [GAMES, STANDINGS, PLAYOFFS] : [GAMES, STANDINGS];
}

export function isSectionActive(section: NavigationSection, pathname: string) {
  return (
    pathname === section.href ||
    section.matchPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}
