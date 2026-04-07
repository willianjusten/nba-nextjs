"use client";

import { isToday } from "date-fns";
import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames,
} from "react-day-picker";
import { ChevronIcon } from "@/app/components";

type CalendarProps = {
  selected?: Date;
} & DayPickerProps;

function Calendar({ classNames, ...props }: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isTodaySelected = !(props.selected && isToday(props.selected));

  return (
    <DayPicker
      showOutsideDays
      classNames={{
        ...defaultClassNames,
        months: "relative",
        month_caption: "relative flex justify-center items-center h-9 mb-4",
        caption_label: "text-sm font-medium",
        button_previous:
          "absolute left-1 top-[2px] z-10 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center cursor-pointer",
        button_next:
          "absolute right-1 top-[2px] z-10 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center cursor-pointer",
        month_grid: "w-full border-collapse",
        weekdays: "flex justify-between mb-2",
        weekday: "rounded-md w-8 font-normal text-[0.8rem] text-slate-400",
        week: "flex w-full mt-2 gap-1",
        day: "p-0 size-8 text-center text-sm relative",
        day_button:
          "size-8 p-0 font-normal flex items-center justify-center rounded-md transition-colors cursor-pointer",
        selected: "bg-white text-black font-bold rounded",
        today: isTodaySelected
          ? "bg-slate-700/50 rounded"
          : "bg-white text-black rounded",
        outside: "opacity-30",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronIcon className="h-4 w-4" />
          ) : (
            <ChevronIcon className="h-4 w-4 rotate-180" />
          ),
      }}
      {...props}
    />
  );
}

export default Calendar;
