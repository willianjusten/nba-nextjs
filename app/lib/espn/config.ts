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
};

export const ESPN_ENDPOINTS = {
  scoreboard: {
    host: "site",
    path: "/apis/site/v2/sports/basketball/nba/scoreboard",
    access: "direct",
  },
} satisfies Record<string, EspnEndpoint>;

export type EspnEndpointName = keyof typeof ESPN_ENDPOINTS;
