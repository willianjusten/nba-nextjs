"use client";

import { lazy, Suspense, useState } from "react";
import type { CalendarPopoverProps } from "./CalendarPopover";
import DatePickerTrigger from "./DatePickerTrigger";

// The popover and its Radix dependency load on first use, keeping them out of the initial bundle.
const loadCalendarPopover = () => import("./CalendarPopover");
const CalendarPopover = lazy(loadCalendarPopover);

export default function DatePicker(props: CalendarPopoverProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const plainTrigger = (
    <DatePickerTrigger
      placement={props.placement}
      onClick={() => setHasOpened(true)}
      onPointerEnter={loadCalendarPopover}
    />
  );

  if (!hasOpened) return plainTrigger;
  return (
    <Suspense fallback={plainTrigger}>
      <CalendarPopover {...props} />
    </Suspense>
  );
}
