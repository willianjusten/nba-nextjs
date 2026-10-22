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
      },
      dehydrate: {
        // Also dehydrate pending queries so server prefetches can stream to the client without being awaited.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        // Next.js already redacts server errors, so let the client see failed prefetches as real errors.
        shouldRedactErrors: () => false,
      },
    },
  });
}
