import type { GameStatus } from "@/app/lib/domain/game";
import { strings } from "@/app/lib/strings";

type ChipTone = "live" | "final" | "tip-off" | "postponed";

const CHIP_BASE_CLASS_NAME =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-meta leading-none font-bold tracking-[0.12em] whitespace-nowrap uppercase";

const CHIP_TONE_CLASS_NAMES: Record<ChipTone, string> = {
  live: "border-live bg-live text-on-live",
  final: "border-white/14 bg-white/8 text-secondary",
  "tip-off": "border-accent/45 bg-accent/16 text-accent-soft",
  postponed: "border-dashed border-white/22 bg-white/5 text-muted",
};

function StatusChip({
  tone,
  children,
}: {
  tone: ChipTone;
  children: React.ReactNode;
}) {
  return (
    <span className={`${CHIP_BASE_CLASS_NAME} ${CHIP_TONE_CLASS_NAMES[tone]}`}>
      {children}
    </span>
  );
}

export function LiveChip() {
  return (
    <StatusChip tone="live">
      <span
        aria-hidden="true"
        className="size-1.5 animate-live-pulse rounded-full bg-on-live"
      />
      {strings.gameStatus.live}
    </StatusChip>
  );
}

// In-game details (period and clock) sit beside the chip as a meta line, so the chip only says which phase the game is in.
export default function GameStatusChip({
  status,
  label,
  startTime,
}: {
  status: GameStatus;
  label: string | null;
  startTime: string;
}) {
  switch (status.kind) {
    case "live":
    case "halftime":
      return <LiveChip />;
    case "scheduled":
      return (
        <StatusChip tone="tip-off">
          {/* Reserves the width of a tip-off time so filling it in on the client doesn't shift the row. */}
          <time
            dateTime={startTime}
            className="inline-block min-w-[8ch] text-center"
          >
            {label}
          </time>
        </StatusChip>
      );
    case "final":
      return <StatusChip tone="final">{label}</StatusChip>;
    case "postponed":
    case "canceled":
      return (
        <StatusChip tone="postponed">
          <span aria-hidden="true">{label}</span>
          <span className="sr-only">
            {status.kind === "postponed"
              ? strings.gameStatus.postponed
              : strings.gameStatus.canceled}
          </span>
        </StatusChip>
      );
  }
}
