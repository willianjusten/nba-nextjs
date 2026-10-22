import {
  ESPN_HOSTS,
  endpointCacheOptions,
  findEndpointForPath,
  type EspnHost,
} from "@/app/lib/espn/config";

type RouteContext = {
  params: Promise<{ host: string; path: string[] }>;
};

function isEspnHost(host: string): host is EspnHost {
  return Object.hasOwn(ESPN_HOSTS, host);
}

export async function GET(request: Request, { params }: RouteContext) {
  const { host, path } = await params;
  if (!isEspnHost(host)) return new Response(null, { status: 404 });

  const { origin, allowedPathPrefix } = ESPN_HOSTS[host];
  // Normalizing through URL resolves ".." segments before the prefix check, so the proxy cannot reach other ESPN APIs.
  const upstreamUrl = new URL(`/${path.join("/")}`, origin);
  if (!upstreamUrl.pathname.startsWith(allowedPathPrefix)) {
    return new Response(null, { status: 404 });
  }
  upstreamUrl.search = new URL(request.url).search;

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    headers: { accept: "application/json" },
    ...endpointCacheOptions(findEndpointForPath(host, upstreamUrl.pathname)),
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "content-type": "application/json",
      "cache-control":
        upstreamResponse.headers.get("cache-control") ?? "no-store",
    },
  });
}
