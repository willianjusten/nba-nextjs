import {
  ESPN_ENDPOINTS,
  ESPN_HOSTS,
  endpointCacheOptions,
  fillPathTemplate,
  type EspnEndpoint,
  type EspnEndpointName,
} from "./config";

export class EspnRequestError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
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
  { searchParams = new URLSearchParams(), pathParams = {} }: EspnRequestOptions,
) {
  const path = fillPathTemplate(endpoint.path, pathParams);
  const query = searchParams.size > 0 ? `?${searchParams}` : "";

  if (isServer || endpoint.access === "direct") {
    return `${ESPN_HOSTS[endpoint.host].origin}${path}${query}`;
  }

  return `/api/espn/${endpoint.host}${path}${query}`;
}

export function rewritePrivateCoreHosts(rawText: string) {
  return rawText.replace(PRIVATE_CORE_HOST_PATTERN, PUBLIC_CORE_ORIGIN);
}

export async function espnGet<RawResponse>(
  endpointName: EspnEndpointName,
  options: EspnRequestOptions = {},
): Promise<RawResponse> {
  const endpoint: EspnEndpoint = ESPN_ENDPOINTS[endpointName];
  const url = buildEspnUrl(endpoint, options);
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    ...endpointCacheOptions(endpoint),
  });

  if (!response.ok) throw new EspnRequestError(url, response.status);

  return JSON.parse(
    rewritePrivateCoreHosts(await response.text()),
  ) as RawResponse;
}
