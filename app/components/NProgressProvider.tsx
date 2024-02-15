"use client";

import { Suspense } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      {children}
      <ProgressBar
        height="4px"
        color="rgb(96 165 250)"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </Suspense>
  );
};

export default NProgressProvider;
