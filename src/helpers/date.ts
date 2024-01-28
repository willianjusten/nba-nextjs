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

const statusTextRegex =
  /^([OT|Q][0-9]{1,2}) [0-9]{1,2}:[0-9]{1,2}(\.[0-9]{1,3})?$/;
/**
 * Migrated from boxscore.js. Formats game status with clock or match status
 * @param {string} clock
 * @param {string} status
 */
export const formatClock = (clock, status, totalPeriod) => {
  if (status === "Half") {
    return "Halftime";
  } else if (status.includes("Halftime") || status.includes("Tipoff")) {
    // game started, clock stopped
    return status;
  } else if (status === "PPD") {
    // PPD mean postponed
    return "Postponed";
  } else if (
    (status.startsWith("Start") || status.startsWith("End")) &&
    status.includes("of")
  ) {
    // Start/End of 1st Qtr/OT
    const statusArray = status.split(" ");
    if (status.includes("Qtr")) {
      return statusArray[0] + " of Q" + statusArray[2].charAt(0);
    } else if (status.includes("OT")) {
      return statusArray[0] + " of OT" + statusArray[2].charAt(0);
    } else {
      return status;
    }
  } else if (
    (status.startsWith("Start") || status.startsWith("End")) &&
    !status.includes("of")
  ) {
    // Start/End Q/OT1
    return status;
  } else if (status && status.includes("Qtr") && status.includes("of")) {
    // game started being played over regular time
    return "Q" + status.charAt(0) + " " + clock;
  } else if (status && status.includes("OT") && status.includes("of")) {
    // game start being played over over time
    return "OT" + status.charAt(0) + " " + clock;
  } else if (status.includes("Final")) {
    if (+totalPeriod > 4) {
      if (status.includes("OT")) {
        return `${status} ${+totalPeriod - 4}`;
      } else {
        return `${status}/OT ${+totalPeriod - 4}`;
      }
    }
    return status;
  } else if (+totalPeriod === 0) {
    return status;
  } else if (statusTextRegex.test(status)) {
    // already formatted
    return status;
  }
  return clock;
};
