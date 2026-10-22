export const ESPN_HOSTS = {
  site: {
    origin: "https://site.api.espn.com",
    // Standings live under /apis/v2, outside the rest of the site API.
    allowedPathPrefixes: [
      "/apis/site/v2/sports/basketball/nba/",
      "/apis/v2/sports/basketball/nba/",
    ],
  },
  core: {
    origin: "https://sports.core.api.espn.com",
    allowedPathPrefixes: ["/v2/sports/basketball/leagues/nba/"],
  },
} as const;

export type EspnHost = keyof typeof ESPN_HOSTS;

// "direct" calls ESPN from the browser; "proxy" goes through the /api/espn route handler.
// Server-side requests always go direct, since they are not subject to CORS.
export type EspnAccess = "direct" | "proxy";

export type EspnEndpoint = {
  host: EspnHost;
  // May contain {placeholders}, filled from the request's path params.
  path: string;
  access: EspnAccess;
  revalidateSeconds?: number;
  // Live scores skip every cache between ESPN's CDN and the app, so a poll never reads an older copy than ESPN serves.
  isLive?: boolean;
};

export const REGULAR_SEASON_TYPE_ID = "2";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const ONE_HOUR_IN_SECONDS = 60 * 60;
const FIVE_MINUTES_IN_SECONDS = 5 * 60;
const TEAMS_PATH = "/apis/site/v2/sports/basketball/nba/teams";
const CORE_NBA_PATH = "/v2/sports/basketball/leagues/nba";

export const ESPN_ENDPOINTS = {
  scoreboard: {
    host: "site",
    path: "/apis/site/v2/sports/basketball/nba/scoreboard",
    access: "direct",
    isLive: true,
  },
  summary: {
    host: "site",
    path: "/apis/site/v2/sports/basketball/nba/summary",
    access: "direct",
    isLive: true,
  },
  // ESPN sends no CORS headers on the teams list and team detail.
  teams: {
    host: "site",
    path: TEAMS_PATH,
    access: "proxy",
    revalidateSeconds: ONE_DAY_IN_SECONDS,
  },
  team: {
    host: "site",
    path: `${TEAMS_PATH}/{teamId}`,
    access: "proxy",
    revalidateSeconds: ONE_DAY_IN_SECONDS,
  },
  teamSchedule: {
    host: "site",
    path: `${TEAMS_PATH}/{teamId}/schedule`,
    access: "direct",
    revalidateSeconds: FIVE_MINUTES_IN_SECONDS,
  },
  standings: {
    host: "site",
    path: "/apis/v2/sports/basketball/nba/standings",
    access: "direct",
  },
  teamRoster: {
    host: "site",
    path: `${TEAMS_PATH}/{teamId}/roster`,
    access: "direct",
  },
  // Leaders are assembled from these three on the server; "proxy" keeps any browser access off ESPN directly.
  currentSeason: {
    host: "core",
    path: `${CORE_NBA_PATH}/season`,
    access: "proxy",
    revalidateSeconds: ONE_HOUR_IN_SECONDS,
  },
  leaders: {
    host: "core",
    path: `${CORE_NBA_PATH}/seasons/{seasonYear}/types/{seasonTypeId}/leaders`,
    access: "proxy",
    revalidateSeconds: ONE_HOUR_IN_SECONDS,
  },
  seasonAthlete: {
    host: "core",
    path: `${CORE_NBA_PATH}/seasons/{seasonYear}/athletes/{athleteId}`,
    access: "proxy",
    revalidateSeconds: ONE_HOUR_IN_SECONDS,
  },
} satisfies Record<string, EspnEndpoint>;

export type EspnEndpointName = keyof typeof ESPN_ENDPOINTS;

export function endpointCacheOptions(
  endpoint: EspnEndpoint | undefined,
): RequestInit {
  if (endpoint?.isLive) return { cache: "no-store" };
  return endpoint?.revalidateSeconds === undefined
    ? {}
    : { next: { revalidate: endpoint.revalidateSeconds } };
}

const PATH_PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

function pathTemplatePattern(pathTemplate: string) {
  return new RegExp(
    `^${pathTemplate.replaceAll(PATH_PLACEHOLDER_PATTERN, "[^/]+")}$`,
  );
}

export function fillPathTemplate(
  pathTemplate: string,
  pathParams: Record<string, string>,
) {
  return pathTemplate.replaceAll(PATH_PLACEHOLDER_PATTERN, (_match, name) => {
    const value = pathParams[name];
    if (value === undefined) {
      throw new Error(`Missing ESPN path param "${name}" for ${pathTemplate}`);
    }
    return encodeURIComponent(value);
  });
}

// Exact template match, so a deeper resource like /teams/13/roster never inherits /teams/{teamId}'s cache period.
export function findEndpointForPath(host: EspnHost, pathname: string) {
  return Object.values<EspnEndpoint>(ESPN_ENDPOINTS).find(
    (endpoint) =>
      endpoint.host === host &&
      pathTemplatePattern(endpoint.path).test(pathname),
  );
}
