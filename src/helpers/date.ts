import { getYear } from "date-fns/getYear";
import { getMonth } from "date-fns/getMonth";
import { addYears } from "date-fns/addYears";

export const getLeagueYear = (date: Date) => {
  if (getYear(date) === 2020) {
    // 2020 season is delayed and season should finish in 2020-10
    return getMonth(date) > 9 ? getYear(date) : getYear(addYears(date, -1));
  } else {
    // if it's after july, it's a new season
    return getMonth(date) > 5 ? getYear(date) : getYear(addYears(date, -1));
  }
};
