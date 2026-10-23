import type { ComponentProps } from "react";
import { strings } from "@/app/lib/strings";
import { FOCUS_RING_CLASS_NAME } from "@/app/components/DatePicker/DatePickerTrigger";

// Spreads every prop so the popover can wrap it as its trigger.
export default function TeamPickerTrigger(
  buttonProps: ComponentProps<"button">,
) {
  return (
    <button
      type="button"
      aria-label={strings.myTeams.pick}
      {...buttonProps}
      className={`group flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full text-[10px] tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground ${FOCUS_RING_CLASS_NAME}`}
    >
      {strings.myTeams.label}
      <span className="flex size-9 items-center justify-center rounded-full border border-dashed border-white/24 transition-colors group-hover:bg-white/5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    </button>
  );
}
