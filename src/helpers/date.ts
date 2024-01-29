import {
  addDays,
  addYears,
  format,
  getHours,
  getMonth,
  getYear,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {
  COVID_MONTH_END,
  COVID_YEAR,
  DATE_LINK_FORMAT,
  EST_IANA_ZONE_ID,
  REGULAR_MONTH_END,
} from "@/constants";

export const getLeagueYear = (date: Date) => {
  if (getYear(date) === COVID_YEAR) {
    // 2020 season is delayed and season should finish in 2020-10
    return getMonth(date) > COVID_MONTH_END
      ? getYear(date)
      : getYear(addYears(date, -1));
  } else {
    // if it's after july, it's a new season
    return getMonth(date) > REGULAR_MONTH_END
      ? getYear(date)
      : getYear(addYears(date, -1));
  }
};

/**
 * Method to return the day, nextDay and prevDay
 * @param date - string of the day - Ex.: '20220214'
 * @returns object of date objects
 */
export function getDays(date?: string) {
  let timeZonedDay: Date;
  const now = new Date().toISOString();
  const etNow = utcToZonedTime(now, EST_IANA_ZONE_ID);
  const etNowHours = getHours(etNow);

  // Some NBA games starts in a day and finishes in the next day
  // in order to show the games that are happening at that time
  // even being the next day, we get the previous day
  if (etNowHours < 6) {
    timeZonedDay = startOfDay(subDays(etNow, 1));
  } else {
    timeZonedDay = startOfDay(etNow);
  }

  const day = date ? parseISO(date) : timeZonedDay;

  return {
    day: format(day, DATE_LINK_FORMAT),
    prevDay: format(subDays(day, 1), DATE_LINK_FORMAT),
    nextDay: format(addDays(day, 1), DATE_LINK_FORMAT),
  };
}

export function formatClock(gameStatusText: string, gameTimeUTC: string) {
  // this means the game didn't start yet, so let's format to show correct timezone
  if (gameStatusText.includes("ET") || gameStatusText.includes("PT")) {
    return format(new Date(gameTimeUTC), "h:mm a");
  }

  return gameStatusText;
}
