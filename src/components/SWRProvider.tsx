"use client";
import { SWRConfig } from "swr";
import type { SWRConfiguration } from "swr";

type SWRProviderProps = {
  children: React.ReactNode;
  fallback: SWRConfiguration["fallback"];
};

const SWRProvider = ({ children, fallback }: SWRProviderProps) => {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
};

export default SWRProvider;
