import {
  ESPN_ENDPOINTS,
  ESPN_HOSTS,
  endpointCacheOptions,
  fillPathTemplate,
  findEndpointForPath,
  type EspnEndpoint,
  type EspnEndpointName,
} from "./config";

export class EspnRequestError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
    readonly responseText: string,
  ) {
    super(`ESPN request failed with status ${status}: ${url}`);
    this.name = "EspnRequestError";
  }
}

// ESPN sometimes returns $ref links on its internal host, which is not reachable from outside.
const PRIVATE_CORE_HOST_PATTERN = /https?:\/\/sports\.core\.api\.espn\.pvt/g;
const PUBLIC_CORE_ORIGIN = ESPN_HOSTS.core.origin;

const isServer = typeof window === "undefined";

type EspnRequestOptions = {
  searchParams?: URLSearchParams;
  // Fills the endpoint path placeholders, e.g. { teamId: "13" } for /teams/{teamId}.
  pathParams?: Record<string, string>;
};

function buildEspnUrl(
  endpoint: EspnEndpoint,
  path: string,
  searchParams = new URLSearchParams(),
) {
  const query = searchParams.size > 0 ? `?${searchParams}` : "";

  if (isServer || endpoint.access === "direct") {
    return `${ESPN_HOSTS[endpoint.host].origin}${path}${query}`;
  }

  return `/api/espn/${endpoint.host}${path}${query}`;
}

export function rewritePrivateCoreHosts(rawText: string) {
  return rawText.replace(PRIVATE_CORE_HOST_PATTERN, PUBLIC_CORE_ORIGIN);
}

async function requestEspn<RawResponse>(
  endpoint: EspnEndpoint,
  url: string,
): Promise<RawResponse> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    ...endpointCacheOptions(endpoint),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new EspnRequestError(url, response.status, responseText);
  }

  return JSON.parse(rewritePrivateCoreHosts(responseText)) as RawResponse;
}

export function espnGet<RawResponse>(
  endpointName: EspnEndpointName,
  { searchParams, pathParams = {} }: EspnRequestOptions = {},
): Promise<RawResponse> {
  const endpoint: EspnEndpoint = ESPN_ENDPOINTS[endpointName];
  const path = fillPathTemplate(endpoint.path, pathParams);
  return requestEspn(endpoint, buildEspnUrl(endpoint, path, searchParams));
}

// Follows a core API $ref link. Only refs to a configured core endpoint are followed, so a ref can never reach another host or API.
export function espnGetRef<RawResponse>(ref: string): Promise<RawResponse> {
  const refUrl = new URL(ref);
  const endpoint =
    refUrl.hostname === new URL(PUBLIC_CORE_ORIGIN).hostname
      ? findEndpointForPath("core", refUrl.pathname)
      : undefined;
  if (!endpoint) {
    throw new Error(`ESPN $ref does not match a configured endpoint: ${ref}`);
  }

  // Refs come over http and carry lang/region params; dropping them keeps one cache entry per resource.
  return requestEspn(endpoint, buildEspnUrl(endpoint, refUrl.pathname));
}
