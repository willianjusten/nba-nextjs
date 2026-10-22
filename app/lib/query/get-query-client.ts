import { isServer, type QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "./make-query-client";

let browserQueryClient: QueryClient | undefined;

// A fresh client per server render keeps data from leaking between requests; the browser reuses one for the whole session.
export function getQueryClient() {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
