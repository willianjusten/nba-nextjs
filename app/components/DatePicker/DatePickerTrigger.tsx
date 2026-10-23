import type { ComponentProps } from "react";
import { strings } from "@/app/lib/strings";

export type DatePickerPlacement = "rail" | "header";

export const FOCUS_RING_CLASS_NAME =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Each placement shows on one breakpoint only: the rail row on desktop, the header on mobile.
const PLACEMENT_CLASS_NAMES: Record<DatePickerPlacement, string> = {
  rail: "hidden min-h-21 shrink-0 flex-col items-center justify-center gap-1.5 rounded-card border border-dashed border-accent/45 bg-accent/8 px-4.5 text-[11px] font-bold tracking-[0.08em] text-accent-soft uppercase transition-colors hover:bg-accent/14 md:flex",
  header:
    "flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-white/12 bg-white/6 text-foreground transition-colors hover:bg-white/10 md:hidden",
};

type DatePickerTriggerProps = ComponentProps<"button"> & {
  placement: DatePickerPlacement;
};

// Spreads every prop so the popover can wrap it as its trigger.
export default function DatePickerTrigger({
  placement,
  ...buttonProps
}: DatePickerTriggerProps) {
  return (
    <button
      type="button"
      // The rail button is named by its visible text; only the icon-only header button needs a label.
      aria-label={
        placement === "header" ? strings.calendar.openCalendar : undefined
      }
      {...buttonProps}
      className={`cursor-pointer ${FOCUS_RING_CLASS_NAME} ${PLACEMENT_CLASS_NAMES[placement]}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
        className={placement === "rail" ? "size-5.5" : "size-5"}
      >
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
      {placement === "rail" && strings.calendar.pickDate}
    </button>
  );
}
