"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  CalendarIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  OutlineButton,
} from "@/app/components";
import { DATE_LINK_FORMAT } from "@/app/constants";

function DatePicker({ day }: { day: string }) {
  const [date, setDate] = useState<Date>(parseISO(day));
  const router = useRouter();

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const currentDate = format(selectedDate, DATE_LINK_FORMAT);

    setDate(selectedDate);
    router.push(`/games/${currentDate}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <OutlineButton
          label={date ? format(date, "PPP") : <span>Pick a date</span>}
          icon={<CalendarIcon className="mr-2 h-4 w-4" />}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
