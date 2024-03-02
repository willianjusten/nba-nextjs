"use client";

import { isToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronIcon } from "@/app/components";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, ...props }: CalendarProps) {
  const isTodaySelected = !(
    isToday(props.selected as string | Date) && Boolean(props.selected)
  );

  return (
    <DayPicker
      showOutsideDays
      className="p-3"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between mb-2",
        head_cell: "rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full gap-1",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-white text-black rounded-md",
        day_today: `${isTodaySelected ? "bg-black" : "bg-white"} rounded-md`,
        day_outside: "opacity-50",
        day_disabled: "opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronIcon className="h-4 w-4" />,
        IconRight: () => <ChevronIcon className="h-4 w-4 rotate-180" />,
      }}
      {...props}
    />
  );
}

export default Calendar;
