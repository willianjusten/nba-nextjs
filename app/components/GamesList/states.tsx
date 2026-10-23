import Link from "next/link";
import { FOCUS_RING_CLASS_NAME } from "@/app/components/DatePicker/DatePickerTrigger";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import type { NextGameDay } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";
import { formatShortNbaDate } from "@/app/lib/time/nba-date";

const LOADING_PLACEHOLDER_COUNT = 4;

// Shared so the loading skeleton keeps the same layout as the loaded games.
export const GAMES_GRID_CLASS_NAME = "grid grid-cols-auto-fill gap-4";

const EMPTY_BOX_CLASS_NAME =
  "flex flex-col items-center gap-2.5 rounded-card border border-dashed border-white/16 p-5 text-center";

function SkeletonTeamRow() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="size-8 rounded-full bg-white/10" />
      <div className="h-3.5 grow rounded-md bg-white/10" />
      <div className="h-6 w-8.5 rounded-md bg-white/10" />
    </div>
  );
}

export function GamesListLoading() {
  return (
    <div role="status" aria-busy="true" className={GAMES_GRID_CLASS_NAME}>
      <span className="sr-only">{strings.games.loading}</span>
      {Array.from({ length: LOADING_PLACEHOLDER_COUNT }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="card flex animate-shimmer flex-col gap-3 p-4"
        >
          <div className="h-4.5 w-16 rounded-full bg-white/10" />
          <SkeletonTeamRow />
          <SkeletonTeamRow />
        </div>
      ))}
    </div>
  );
}

type GamesListErrorProps = {
  onRetry: () => void;
  isRetrying: boolean;
};

export function GamesListError({ onRetry, isRetrying }: GamesListErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-card border border-live/28 bg-live/6 p-5 text-center"
    >
      <p className="font-bold">{strings.games.error}</p>
      <p className="text-sm text-muted">{strings.games.errorDetail}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className={`min-h-11 cursor-pointer rounded-full bg-accent px-5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-soft disabled:cursor-default disabled:opacity-60 ${FOCUS_RING_CLASS_NAME}`}
      >
        {isRetrying ? strings.games.retrying : strings.games.retry}
      </button>
    </div>
  );
}

type GamesListEmptyProps = {
  nbaDate: NbaDate;
  nextGameDay: NextGameDay | null;
};

export function GamesListEmpty({ nbaDate, nextGameDay }: GamesListEmptyProps) {
  return (
    <div className={EMPTY_BOX_CLASS_NAME}>
      <BasketballIcon className="size-7 text-muted" />
      <p className="font-bold">
        {strings.games.empty(formatShortNbaDate(nbaDate))}
      </p>
      {nextGameDay && (
        <Link
          href={nextGameDay.href}
          className="inline-flex min-h-11 items-center text-sm font-bold text-link transition-colors hover:text-accent"
        >
          {strings.games.nextGames(nextGameDay.label)}
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      )}
    </div>
  );
}

export function GamesListNoMatches({ message }: { message: string }) {
  return (
    <div className={EMPTY_BOX_CLASS_NAME}>
      <BasketballIcon className="size-7 text-muted" />
      <p className="font-bold">{message}</p>
    </div>
  );
}

export function StaleScoresNotice({ minutesAgo }: { minutesAgo: number }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2.5 rounded-xl border border-warning/32 bg-warning/8 px-3 py-2.5"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="size-4 shrink-0 text-warning"
      >
        <path d="M12 8v5M12 16.5v.5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      <p className="grow text-sm text-warning-soft">
        {strings.games.stale(minutesAgo)}
      </p>
      <span className="text-meta text-muted">
        {strings.games.retryingAutomatically}
      </span>
    </div>
  );
}

function BasketballIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18" />
    </svg>
  );
}
