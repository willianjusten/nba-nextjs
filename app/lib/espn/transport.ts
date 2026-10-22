import {
  ESPN_ENDPOINTS,
  ESPN_HOSTS,
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

function buildEspnUrl(endpoint: EspnEndpoint, searchParams: URLSearchParams) {
  const query = searchParams.size > 0 ? `?${searchParams}` : "";

  if (isServer || endpoint.access === "direct") {
    return `${ESPN_HOSTS[endpoint.host].origin}${endpoint.path}${query}`;
  }

  return `/api/espn/${endpoint.host}${endpoint.path}${query}`;
}

export function rewritePrivateCoreHosts(rawText: string) {
  return rawText.replace(PRIVATE_CORE_HOST_PATTERN, PUBLIC_CORE_ORIGIN);
}

export async function espnGet<RawResponse>(
  endpointName: EspnEndpointName,
  searchParams: URLSearchParams = new URLSearchParams(),
): Promise<RawResponse> {
  const url = buildEspnUrl(ESPN_ENDPOINTS[endpointName], searchParams);
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) throw new EspnRequestError(url, response.status);

  return JSON.parse(
    rewritePrivateCoreHosts(await response.text()),
  ) as RawResponse;
}
