import { strings } from "@/app/lib/strings";

export type NavigationSection = {
  href: string;
  label: string;
  // Other path prefixes that belong to the section, so date pages keep Games highlighted.
  matchPrefixes: string[];
};

const GAMES: NavigationSection = {
  href: "/",
  label: strings.shell.sections.games,
  matchPrefixes: ["/games/"],
};

const STANDINGS: NavigationSection = {
  href: "/standings",
  label: strings.shell.sections.standings,
  matchPrefixes: [],
};

const PLAYOFFS: NavigationSection = {
  href: "/playoffs",
  label: strings.shell.sections.playoffs,
  matchPrefixes: [],
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
