import {
  addDays,
  addYears,
  format,
  getMonth,
  getYear,
  parseISO,
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
  const now = new Date().toISOString();
  const etNow = utcToZonedTime(now, EST_IANA_ZONE_ID);
  const day = date ? parseISO(date) : etNow;

  return {
    day: format(day, DATE_LINK_FORMAT),
    prevDay: format(subDays(day, 1), DATE_LINK_FORMAT),
    nextDay: format(addDays(day, 1), DATE_LINK_FORMAT),
  };
}
