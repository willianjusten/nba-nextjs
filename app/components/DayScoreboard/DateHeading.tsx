import type {
  DateHeading as DateHeadingView,
  GamesSummary,
} from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";

type DateHeadingProps = {
  heading: DateHeadingView;
  summary: GamesSummary | null;
  // Sits at the end of the heading row on mobile, such as the date picker.
  children?: React.ReactNode;
};

// Mobile and desktop show different date shapes, so both are hidden from assistive tech and the full date is read once.
export default function DateHeading({
  heading,
  summary,
  children,
}: DateHeadingProps) {
  return (
    <header className="flex items-center gap-3">
      <div className="flex grow flex-col gap-1 md:flex-row md:flex-wrap md:items-end md:gap-4">
        <h1 className="flex flex-col gap-1">
          <span className="sr-only">{heading.label}</span>
          <span
            aria-hidden="true"
            className="font-display text-3xl leading-tight uppercase md:hidden"
          >
            {heading.compact}
          </span>
          <span
            aria-hidden="true"
            className="hidden text-[13px] tracking-[0.18em] text-muted uppercase md:block"
          >
            {heading.weekday}
          </span>
          <span
            aria-hidden="true"
            className="hidden font-display text-[58px] leading-[0.92] tracking-[0.01em] md:block"
          >
            {heading.monthDay}
          </span>
        </h1>
        {summary && (
          <p className="text-sm text-muted md:mb-2.5">
            {strings.home.summary(summary)}
          </p>
        )}
      </div>
      {children}
    </header>
  );
}
