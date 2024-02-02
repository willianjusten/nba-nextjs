"use client";
import { SWRConfig } from "swr";

const SWRProvider = ({ children, fallback }) => {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
};

export default SWRProvider;
