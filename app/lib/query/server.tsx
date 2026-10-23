import "server-only";
import { cache, type ReactNode } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "./make-query-client";

// React cache scopes the client to a single server request, shared by every server component that prefetches in it.
// Server components must prefetch through this client, and before <Hydrate> renders, or the data is not dehydrated.
export const getServerQueryClient = cache(makeQueryClient);

export function Hydrate({ children }: { children: ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getServerQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}
