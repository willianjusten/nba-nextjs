import Link from "next/link";
import { format } from "date-fns";

import { ArrowIcon } from "@/app/components";
import DatePicker from "@/app/components/DatePicker";
import { DATE_LINK_FORMAT } from "@/app/constants";

export type DateSelectorProps = {
  day: string;
  nextDay: string;
  prevDay: string;
};

function DateSelector({ day, nextDay, prevDay }: DateSelectorProps) {
  const today = format(new Date(), DATE_LINK_FORMAT);
  const prevLink = `/games/${prevDay}`;
  const nextLink = `/games/${nextDay}`;

  return (
    <div className="flex flex-col py-12">
      <h1 className="mb-3 text-4xl font-bold">Games</h1>
      <div className="flex items-center justify-between gap-5 pt-4 sm:justify-start">
        <Link className="p-2" href={prevLink}>
          <ArrowIcon title="previous day" />
        </Link>

        <DatePicker day={day} />

        <Link className="p-2" href={nextLink}>
          <ArrowIcon className="rotate-180" title="next day" />
        </Link>
      </div>
    </div>
  );
}

export default DateSelector;
