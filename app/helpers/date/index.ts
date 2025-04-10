import {
  addDays,
  addYears,
  format,
  getMonth,
  getYear,
  parseISO,
  subDays,
} from "date-fns";
import {
  COVID_MONTH_END,
  COVID_YEAR,
  DATE_LINK_FORMAT,
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
  const now = new Date().toISOString();
  const day = parseISO(date ?? now);

  return {
    day: format(day, DATE_LINK_FORMAT),
    prevDay: format(subDays(day, 1), DATE_LINK_FORMAT),
    nextDay: format(addDays(day, 1), DATE_LINK_FORMAT),
  };
}
