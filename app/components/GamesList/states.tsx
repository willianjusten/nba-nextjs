import { strings } from "@/app/lib/strings";

const LOADING_PLACEHOLDER_COUNT = 4;

// Shared so the loading skeleton keeps the same layout as the loaded games.
export const GAMES_GRID_CLASS_NAME = "grid grid-cols-auto-fill gap-4";

export function GamesListLoading() {
  return (
    <div role="status" aria-busy="true" className={GAMES_GRID_CLASS_NAME}>
      <span className="sr-only">{strings.games.loading}</span>
      {Array.from({ length: LOADING_PLACEHOLDER_COUNT }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-36 animate-pulse rounded-lg bg-glass"
        />
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
    <div className="flex flex-col items-start gap-3 rounded-lg bg-glass p-4">
      <p role="alert">{strings.games.error}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="rounded-md border border-white/25 px-4 py-2 font-medium disabled:opacity-60"
      >
        {isRetrying ? strings.games.retrying : strings.games.retry}
      </button>
    </div>
  );
}

export function GamesListEmpty() {
  return (
    <p className="rounded-lg bg-glass p-4 text-slate-300">
      {strings.games.empty}
    </p>
  );
}
