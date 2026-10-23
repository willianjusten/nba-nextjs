"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
// The server, and the first client render that hydrates its markup, don't know the viewer's timezone.
const unknownTimeZone = () => null;

export function useBrowserTimeZone(): string | null {
  return useSyncExternalStore(
    subscribeToNothing,
    browserTimeZone,
    unknownTimeZone,
  );
}
