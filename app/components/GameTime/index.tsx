"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const localDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type GameTimeProps = {
  startTime: string;
  // The local date can differ from the NBA date, so lists spanning several days show it too.
  showDate?: boolean;
};

// The browser timezone is unknown during server rendering, so the time is only filled in on the client to avoid a hydration mismatch.
export default function GameTime({
  startTime,
  showDate = false,
}: GameTimeProps) {
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const startTimeFormatter = showDate
    ? localDateTimeFormatter
    : localTimeFormatter;

  return (
    <time dateTime={startTime} suppressHydrationWarning>
      {isClient ? startTimeFormatter.format(new Date(startTime)) : null}
    </time>
  );
}
