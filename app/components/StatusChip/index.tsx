import type { GameStatus } from "@/app/lib/domain/game";
import { strings } from "@/app/lib/strings";
import GameStatusLabel from "@/app/components/GameStatusLabel";

type ChipTone = "live" | "final" | "tip-off" | "postponed" | "my-team";

const CHIP_BASE_CLASS_NAME =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-meta leading-none font-bold tracking-[0.12em] whitespace-nowrap uppercase";

const CHIP_TONE_CLASS_NAMES: Record<ChipTone, string> = {
  live: "border-live bg-live text-on-live",
  final: "border-white/14 bg-white/8 text-secondary",
  "tip-off": "border-accent/45 bg-accent/16 text-accent-soft",
  postponed: "border-dashed border-white/22 bg-white/5 text-muted",
  "my-team": "border-favorite/40 bg-favorite/12 text-favorite-soft",
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

export function MyTeamChip() {
  return (
    <StatusChip tone="my-team">
      <StarIcon />
      {strings.gameStatus.myTeam}
    </StatusChip>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3 fill-favorite"
    >
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

// In-game details (period and clock) sit beside the chip as a meta line, so the chip only says which phase the game is in.
export default function GameStatusChip({
  status,
  startTime,
}: {
  status: GameStatus;
  startTime: string;
}) {
  switch (status.kind) {
    case "live":
    case "halftime":
      return <LiveChip />;
    case "scheduled":
      return (
        <StatusChip tone="tip-off">
          <GameStatusLabel status={status} startTime={startTime} />
        </StatusChip>
      );
    case "final":
      return (
        <StatusChip tone="final">
          <GameStatusLabel status={status} startTime={startTime} />
        </StatusChip>
      );
    case "postponed":
    case "canceled":
      return (
        <StatusChip tone="postponed">
          <span aria-hidden="true">{strings.gameStatus.postponedShort}</span>
          <span className="sr-only">
            <GameStatusLabel status={status} startTime={startTime} />
          </span>
        </StatusChip>
      );
  }
}
