import type { NbaDate } from "@/app/lib/domain/nba-date";

const formattersByTimeZone = new Map<
  string,
  {
    time: Intl.DateTimeFormat;
    weekday: Intl.DateTimeFormat;
    date: Intl.DateTimeFormat;
  }
>();

function formattersFor(timeZone: string) {
  let formatters = formattersByTimeZone.get(timeZone);
  if (!formatters) {
    formatters = {
      time: new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
      }),
      weekday: new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }),
      // en-CA formats dates as YYYY-MM-DD, the NbaDate shape.
      date: new Intl.DateTimeFormat("en-CA", { timeZone }),
    };
    formattersByTimeZone.set(timeZone, formatters);
  }
  return formatters;
}

// A late ET tip-off can land on the next local day, so the weekday is added whenever the local day differs.
export function formatTipOff(
  startTime: string,
  nbaDate: NbaDate,
  timeZone: string,
) {
  const formatters = formattersFor(timeZone);
  const startInstant = new Date(startTime);
  const localTime = formatters.time.format(startInstant);

  return formatters.date.format(startInstant) === nbaDate
    ? localTime
    : `${formatters.weekday.format(startInstant)} ${localTime}`;
}
