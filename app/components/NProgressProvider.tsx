"use client";

import { ProgressProvider } from "@bprogress/next/app";

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="4px"
      color="rgb(96 165 250)"
      options={{ showSpinner: false }}
      shallowRouting
      startOnLoad
      delay={0}
      stopDelay={100}
    >
      {children}
    </ProgressProvider>
  );
};

export default NProgressProvider;
