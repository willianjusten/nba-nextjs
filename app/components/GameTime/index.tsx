"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

type GameTimeProps = {
  startTime: string;
};

// The browser timezone is unknown during server rendering, so the time is only filled in on the client to avoid a hydration mismatch.
export default function GameTime({ startTime }: GameTimeProps) {
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  return (
    <time dateTime={startTime} suppressHydrationWarning>
      {isClient ? localTimeFormatter.format(new Date(startTime)) : null}
    </time>
  );
}
