import type { GameStatus } from "@/app/lib/domain/game";
import { strings } from "@/app/lib/strings";
import GameTime from "@/app/components/GameTime";

const REGULATION_PERIODS = 4;
const STATUSES_WITHOUT_SCORE: ReadonlyArray<GameStatus["kind"]> = [
  "scheduled",
  "postponed",
  "canceled",
];

export function hasScore(status: GameStatus) {
  return !STATUSES_WITHOUT_SCORE.includes(status.kind);
}

export function periodLabel(period: number) {
  return period <= REGULATION_PERIODS
    ? strings.gameStatus.quarter(period)
    : strings.gameStatus.overtime(period - REGULATION_PERIODS);
}

export default function GameStatusLabel({
  status,
  startTime,
}: {
  status: GameStatus;
  startTime: string;
}) {
  switch (status.kind) {
    case "scheduled":
      return <GameTime startTime={startTime} />;
    case "live":
      return `${periodLabel(status.period)} ${status.clock}`;
    case "halftime":
      return strings.gameStatus.halftime;
    case "final":
      return status.period > REGULATION_PERIODS
        ? strings.gameStatus.finalAfter(periodLabel(status.period))
        : strings.gameStatus.final;
    case "postponed":
      return strings.gameStatus.postponed;
    case "canceled":
      return strings.gameStatus.canceled;
  }
}
