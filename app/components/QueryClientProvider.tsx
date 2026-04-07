"use client";

import {
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import { getQueryClient } from "@/app/lib/queryClient";

type QueryClientProviderProps = {
  children: ReactNode;
  dehydratedState?: DehydratedState;
};

const QueryClientProviderComponent = ({
  children,
  dehydratedState,
}: QueryClientProviderProps) => {
  const queryClient = useMemo(() => getQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
};

export default QueryClientProviderComponent;
