import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Above zero so the client does not refetch right after hydrating server-prefetched data.
        staleTime: 60 * 1000,
        // Failed server prefetches are not dehydrated, so the client fetches again; one retry keeps the error state from taking several seconds to appear.
        retry: 1,
      },
      dehydrate: {
        // Also dehydrate pending queries so server prefetches can stream to the client without being awaited.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
