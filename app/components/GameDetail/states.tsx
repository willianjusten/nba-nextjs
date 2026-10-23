import { strings } from "@/app/lib/strings";

export function GameDetailLoading() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-4">
      <span className="sr-only">{strings.game.loading}</span>
      <div aria-hidden="true" className="h-32 animate-shimmer card" />
      <div aria-hidden="true" className="h-64 animate-shimmer card" />
    </div>
  );
}

type GameDetailErrorProps = {
  onRetry: () => void;
  isRetrying: boolean;
};

export function GameDetailError({ onRetry, isRetrying }: GameDetailErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 card p-4">
      <p role="alert">{strings.game.error}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="min-h-11 rounded-full bg-accent px-5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-soft disabled:opacity-60"
      >
        {isRetrying ? strings.game.retrying : strings.game.retry}
      </button>
    </div>
  );
}

export function StaleGameNotice() {
  return (
    <p role="status" className="text-sm text-warning">
      {strings.game.stale}
    </p>
  );
}
