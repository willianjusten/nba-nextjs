import type { GameStatus } from "@/app/lib/domain/game";
import { strings } from "@/app/lib/strings";

const REGULATION_PERIODS = 4;
const STATUSES_WITHOUT_SCORE: ReadonlyArray<GameStatus["kind"]> = [
  "scheduled",
  "postponed",
  "canceled",
];

export function hasScore(status: GameStatus) {
  return !STATUSES_WITHOUT_SCORE.includes(status.kind);
}

export function isInProgress(status: GameStatus) {
  return status.kind === "live" || status.kind === "halftime";
}

function wentToOvertime(period: number) {
  return period > REGULATION_PERIODS;
}

export function periodLabel(period: number) {
  return wentToOvertime(period)
    ? strings.gameStatus.overtime(period - REGULATION_PERIODS)
    : strings.gameStatus.quarter(period);
}

export function finalLabel(period: number) {
  return wentToOvertime(period)
    ? strings.gameStatus.finalAfter(periodLabel(period))
    : strings.gameStatus.final;
}
