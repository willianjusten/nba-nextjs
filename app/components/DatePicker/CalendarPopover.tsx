"use client";

import { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { buildCalendarMonth, type CalendarDay } from "@/app/lib/home/home-view";
import { seasonCalendarQueryOptions } from "@/app/lib/queries/season-calendar";
import { seasonStartYearOf } from "@/app/lib/season/season-year";
import { strings } from "@/app/lib/strings";
import { startOfNbaMonth } from "@/app/lib/time/nba-date";
import DatePickerTrigger, {
  FOCUS_RING_CLASS_NAME,
  type DatePickerPlacement,
} from "./DatePickerTrigger";

export type CalendarPopoverProps = {
  placement: DatePickerPlacement;
  selectedDate: NbaDate;
  today: NbaDate;
  onSelect: (day: CalendarDay) => void;
};

// Mounted on the first click of the trigger, so it starts open.
export default function CalendarPopover({
  placement,
  selectedDate,
  today,
  onSelect,
}: CalendarPopoverProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [monthStart, setMonthStart] = useState(() =>
    startOfNbaMonth(selectedDate),
  );
  // The shown month's own season, so browsing past an offseason still marks the next season's game days.
  const { data: seasonCalendar } = useQuery(
    seasonCalendarQueryOptions(seasonStartYearOf(monthStart)),
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const month = buildCalendarMonth({
    monthStart,
    selectedDate,
    today,
    seasonCalendar: seasonCalendar ?? null,
  });

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(nextIsOpen) => {
        setIsOpen(nextIsOpen);
        if (nextIsOpen) setMonthStart(startOfNbaMonth(selectedDate));
      }}
    >
      <Popover.Trigger asChild>
        <DatePickerTrigger placement={placement} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={contentRef}
          aria-label={strings.calendar.pickDateLabel}
          align="end"
          sideOffset={8}
          collisionPadding={16}
          onOpenAutoFocus={(event) => {
            const selectedDay = contentRef.current?.querySelector<HTMLElement>(
              "[aria-pressed=true]",
            );
            if (!selectedDay) return;
            event.preventDefault();
            selectedDay.focus();
          }}
          className="z-50 flex w-[min(22.5rem,calc(100vw-2rem))] flex-col gap-3 card border-white/10 bg-white/4.5 backdrop-blur-xl p-3 md:p-4 text-foreground shadow-[0_24px_48px_rgb(0_0_0/0.45)]"
        >
          <div className="flex items-center justify-between gap-2">
            <MonthArrowButton
              label={strings.calendar.previousMonth}
              onClick={() => setMonthStart(month.previousMonthStart)}
            >
              <path d="M15 6l-6 6 6 6" />
            </MonthArrowButton>
            <p
              aria-live="polite"
              className="font-display text-2xl leading-none tracking-[0.04em]"
            >
              {month.title}
            </p>
            <MonthArrowButton
              label={strings.calendar.nextMonth}
              onClick={() => setMonthStart(month.nextMonthStart)}
            >
              <path d="M9 6l6 6-6 6" />
            </MonthArrowButton>
          </div>
          <div
            aria-hidden="true"
            className="grid grid-cols-7 text-center text-[10px] tracking-[0.14em] text-muted"
          >
            {month.weekdays.map((weekday, weekdayIndex) => (
              <span key={weekdayIndex}>{weekday}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {month.weeks.flat().map((day, cellIndex) =>
              day ? (
                <CalendarDayButton
                  key={day.nbaDate}
                  day={day}
                  onClick={() => {
                    setIsOpen(false);
                    onSelect(day);
                  }}
                />
              ) : (
                <span key={`padding-${cellIndex}`} />
              ),
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function CalendarDayButton({
  day,
  onClick,
}: {
  day: CalendarDay;
  onClick: () => void;
}) {
  const toneClassName = day.isSelected
    ? "bg-accent font-bold text-on-accent"
    : day.hasGames
      ? "font-bold text-foreground hover:bg-white/8"
      : "text-muted hover:bg-white/8";
  const todayClassName =
    day.isToday && !day.isSelected ? "border border-accent/60" : "";

  return (
    <button
      type="button"
      aria-label={day.label}
      aria-pressed={day.isSelected}
      aria-current={day.isToday ? "date" : undefined}
      onClick={onClick}
      className={`relative flex min-h-11 cursor-pointer items-center justify-center rounded-tile text-sm transition-colors ${FOCUS_RING_CLASS_NAME} ${toneClassName} ${todayClassName}`}
    >
      {day.dayNumber}
      {day.hasGames && (
        <span
          aria-hidden="true"
          className={`absolute bottom-1 size-1 rounded-full ${day.isSelected ? "bg-on-accent" : "bg-accent"}`}
        />
      )}
    </button>
  );
}

type MonthArrowButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function MonthArrowButton({ label, onClick, children }: MonthArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/4 text-secondary transition-colors hover:bg-white/8 ${FOCUS_RING_CLASS_NAME}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}
