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
import { toZonedTime } from "date-fns-tz";
import {
  COVID_MONTH_END,
  COVID_YEAR,
  DATE_LINK_FORMAT,
  EST_IANA_ZONE_ID,
  REGULAR_MONTH_END,
} from "@/app/constants";

/**
 * Get the current year of the season
 * @param date - any date
 * @returns number - year of the season
 *
 * Eg.: '2024-02-08' => 2023
 * Eg.: '2024-10-02' => 2024
 */
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
  const etNow = toZonedTime(now, EST_IANA_ZONE_ID);
  const etNowHours = getHours(etNow);

  // The NBA API for today returns games from the day before
  // during the morning, so people can see the games that happened
  // during the day before, after this time, the API returns games
  // from the current day, so we need to adjust the day to the current day
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
