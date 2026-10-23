"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { DateRailView, RailDay } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";

// The rail fits 7 days at a time, so the selected day sits in the middle with 3 on each side.
const DAYS_BESIDE_CENTER = 3;

const FOCUS_RING_CLASS_NAME =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type DateRailProps = {
  rail: DateRailView;
  onSelect: (day: RailDay) => void;
  onPreview: (day: RailDay) => void;
  // Rendered at the end of the row, after the arrows, such as the date picker.
  children?: React.ReactNode;
};

export default function DateRail({
  rail,
  onSelect,
  onPreview,
  children,
}: DateRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasCenteredRef = useRef(false);
  const selectedIndex = rail.days.findIndex((day) => day.isSelected);

  const measureDayStepPixels = () => {
    const [firstPill, secondPill] = scrollerRef.current?.children ?? [];
    return firstPill instanceof HTMLElement && secondPill instanceof HTMLElement
      ? secondPill.offsetLeft - firstPill.offsetLeft
      : 0;
  };

  const slide = (direction: -1 | 1) =>
    scrollerRef.current?.scrollBy({
      left: direction * measureDayStepPixels(),
      behavior: "smooth",
    });

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || hasCenteredRef.current || selectedIndex < 0) return;
    hasCenteredRef.current = true;
    scroller.scrollLeft =
      (selectedIndex - DAYS_BESIDE_CENTER) * measureDayStepPixels();
  }, [selectedIndex]);

  // Later selections, such as going back in history, only scroll when the day is out of view.
  // Scrolling the rail itself, unlike scrollIntoView, never moves the page vertically.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasCenteredRef.current || selectedIndex < 0) return;
    const dayStepPixels = measureDayStepPixels();
    const firstVisibleIndex = Math.round(scroller.scrollLeft / dayStepPixels);
    const visibleDayCount = DAYS_BESIDE_CENTER * 2 + 1;
    if (
      selectedIndex >= firstVisibleIndex &&
      selectedIndex < firstVisibleIndex + visibleDayCount
    ) {
      return;
    }
    scroller.scrollTo({
      left: (selectedIndex - DAYS_BESIDE_CENTER) * dayStepPixels,
      behavior: "smooth",
    });
  }, [selectedIndex]);

  return (
    <div className="flex items-center gap-2.5">
      <SlideArrowButton
        label={strings.dateRail.previousDays}
        onClick={() => slide(-1)}
      >
        <path d="M15 6l-6 6 6 6" />
      </SlideArrowButton>
      <div
        ref={scrollerRef}
        role="group"
        aria-label={strings.dateRail.label}
        className="relative -mx-4 flex min-w-0 grow snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:gap-2.5 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {rail.days.map((day) => (
          <DayPill
            key={day.nbaDate}
            day={day}
            onClick={() => onSelect(day)}
            onPreview={() => onPreview(day)}
          />
        ))}
      </div>
      <SlideArrowButton
        label={strings.dateRail.nextDays}
        onClick={() => slide(1)}
      >
        <path d="M9 6l6 6-6 6" />
      </SlideArrowButton>
      {children}
    </div>
  );
}

type DayPillProps = {
  day: RailDay;
  onClick: () => void;
  onPreview: () => void;
};

function DayPill({ day, onClick, onPreview }: DayPillProps) {
  const toneClassName = day.isSelected
    ? "-translate-y-0.5 border-accent bg-accent text-on-accent md:-translate-y-0.75"
    : "border-white/10 bg-white/5 text-foreground hover:bg-white/8";
  const secondaryTextClassName = day.isSelected ? "opacity-75" : "text-muted";

  return (
    <button
      type="button"
      aria-label={day.label}
      aria-pressed={day.isSelected}
      onClick={onClick}
      onPointerEnter={onPreview}
      onFocus={onPreview}
      className={`relative cursor-pointer flex min-h-16 shrink-0 basis-[calc((100%-6*0.5rem)/7)] snap-start flex-col items-center gap-0.75 rounded-tile border py-2.25 transition-[background-color,translate] md:min-h-21 md:basis-[calc((100%-6*0.625rem)/7)] md:rounded-card md:px-3.5 md:py-3 ${FOCUS_RING_CLASS_NAME} ${toneClassName}`}
    >
      <span
        className={`text-[10px] tracking-[0.14em] ${secondaryTextClassName}`}
      >
        {day.weekday}
      </span>
      <span className="font-display text-[22px] leading-none md:text-2xl">
        {day.dayNumber}
      </span>
      {day.countLabel && (
        <span
          className={`hidden text-[10px] whitespace-nowrap md:block ${secondaryTextClassName}`}
        >
          {day.countLabel}
        </span>
      )}
      {day.hasGames && (
        <span
          aria-hidden="true"
          className={`absolute bottom-1.5 size-1 rounded-full md:hidden ${day.isSelected ? "bg-on-accent" : "bg-accent"}`}
        />
      )}
    </button>
  );
}

type SlideArrowButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function SlideArrowButton({ label, onClick, children }: SlideArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`hidden cursor-pointer size-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/4 text-secondary transition-colors hover:bg-white/8 md:flex ${FOCUS_RING_CLASS_NAME}`}
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
