import { strings } from "@/app/lib/strings";

export function GameDetailLoading() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-4">
      <span className="sr-only">{strings.game.loading}</span>
      <div
        aria-hidden="true"
        className="h-32 animate-pulse rounded-lg bg-glass"
      />
      <div
        aria-hidden="true"
        className="h-64 animate-pulse rounded-lg bg-glass"
      />
    </div>
  );
}

type GameDetailErrorProps = {
  onRetry: () => void;
  isRetrying: boolean;
};

export function GameDetailError({ onRetry, isRetrying }: GameDetailErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg bg-glass p-4">
      <p role="alert">{strings.game.error}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="rounded-md border border-white/25 px-4 py-2 font-medium disabled:opacity-60"
      >
        {isRetrying ? strings.game.retrying : strings.game.retry}
      </button>
    </div>
  );
}

export function StaleGameNotice() {
  return (
    <p role="status" className="text-sm text-amber-300">
      {strings.game.stale}
    </p>
  );
}
