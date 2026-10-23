"use client";

import { useRouter } from "next/navigation";
import type { DateRailView, RailDay } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";

const FOCUS_RING_CLASS_NAME =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function DateRail({ rail }: { rail: DateRailView }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2.5">
      <WeekArrowButton
        label={strings.dateRail.previousWeek}
        onClick={() => router.push(rail.previousWeekHref)}
      >
        <path d="M15 6l-6 6 6 6" />
      </WeekArrowButton>
      <div
        role="group"
        aria-label={strings.dateRail.label}
        className="-mx-4 flex min-w-0 grow scrollbar-hidden gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:gap-2.5 md:px-0"
      >
        {rail.days.map((day) => (
          <DayPill
            key={day.nbaDate}
            day={day}
            onClick={() => router.push(day.href)}
          />
        ))}
      </div>
      <WeekArrowButton
        label={strings.dateRail.nextWeek}
        onClick={() => router.push(rail.nextWeekHref)}
      >
        <path d="M9 6l6 6-6 6" />
      </WeekArrowButton>
    </div>
  );
}

function DayPill({ day, onClick }: { day: RailDay; onClick: () => void }) {
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
      className={`relative flex min-h-16 min-w-11 flex-1 basis-0 flex-col items-center gap-0.75 rounded-tile border py-2.25 transition-[background-color,translate] md:min-h-21 md:rounded-card md:px-3.5 md:py-3 ${FOCUS_RING_CLASS_NAME} ${toneClassName}`}
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
      {day.gameCount !== null && day.gameCount > 0 && (
        <span
          aria-hidden="true"
          className={`absolute bottom-1.5 size-1 rounded-full md:hidden ${day.isSelected ? "bg-on-accent" : "bg-accent"}`}
        />
      )}
    </button>
  );
}

type WeekArrowButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function WeekArrowButton({ label, onClick, children }: WeekArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`hidden size-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/4 text-secondary transition-colors hover:bg-white/8 md:flex ${FOCUS_RING_CLASS_NAME}`}
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
