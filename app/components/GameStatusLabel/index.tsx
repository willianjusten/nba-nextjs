import type { GameStatus } from "@/app/lib/domain/game";
import { finalLabel, periodLabel } from "@/app/lib/game/status";
import { strings } from "@/app/lib/strings";
import GameTime from "@/app/components/GameTime";

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
      return finalLabel(status.period);
    case "postponed":
      return strings.gameStatus.postponed;
    case "canceled":
      return strings.gameStatus.canceled;
  }
}
