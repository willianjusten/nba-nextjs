export const ESPN_HOSTS = {
  site: {
    origin: "https://site.api.espn.com",
    allowedPathPrefix: "/apis/site/v2/sports/basketball/nba/",
  },
  core: {
    origin: "https://sports.core.api.espn.com",
    allowedPathPrefix: "/v2/sports/basketball/leagues/nba/",
  },
} as const;

export type EspnHost = keyof typeof ESPN_HOSTS;

// "direct" calls ESPN from the browser; "proxy" goes through the /api/espn route handler.
// Server-side requests always go direct, since they are not subject to CORS.
export type EspnAccess = "direct" | "proxy";

export type EspnEndpoint = {
  host: EspnHost;
  path: string;
  access: EspnAccess;
  revalidateSeconds?: number;
};

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

export const ESPN_ENDPOINTS = {
  scoreboard: {
    host: "site",
    path: "/apis/site/v2/sports/basketball/nba/scoreboard",
    access: "direct",
  },
  // Covers the teams list and each team detail (/teams/{id}). ESPN sends no CORS headers here.
  teams: {
    host: "site",
    path: "/apis/site/v2/sports/basketball/nba/teams",
    access: "proxy",
    revalidateSeconds: ONE_DAY_IN_SECONDS,
  },
} satisfies Record<string, EspnEndpoint>;

export type EspnEndpointName = keyof typeof ESPN_ENDPOINTS;

export function endpointCacheOptions(endpoint: EspnEndpoint | undefined) {
  return endpoint?.revalidateSeconds === undefined
    ? {}
    : { next: { revalidate: endpoint.revalidateSeconds } };
}

// Matches the endpoint path or one segment below it (e.g. /teams/13), so deeper resources like
// /teams/13/schedule never inherit an endpoint's cache period.
export function findEndpointForPath(host: EspnHost, pathname: string) {
  return Object.values<EspnEndpoint>(ESPN_ENDPOINTS).find((endpoint) => {
    if (endpoint.host !== host) return false;
    if (pathname === endpoint.path) return true;

    const isOneSegmentBelow = /^\/[^/]+$/.test(
      pathname.slice(endpoint.path.length),
    );
    return pathname.startsWith(endpoint.path) && isOneSegmentBelow;
  });
}
