import type { NbaDate } from "@/app/lib/domain/nba-date";
import type { HomeScreen } from "@/app/lib/home/home-view";
import GameCard from "@/app/components/GameCard";
import {
  GAMES_GRID_CLASS_NAME,
  GamesListEmpty,
  GamesListError,
  GamesListLoading,
  StaleScoresNotice,
} from "./states";

type GamesListProps = {
  nbaDate: NbaDate;
  screen: HomeScreen;
  onRetry: () => void;
  isRetrying: boolean;
};

export default function GamesList({
  nbaDate,
  screen,
  onRetry,
  isRetrying,
}: GamesListProps) {
  switch (screen.kind) {
    case "loading":
      return <GamesListLoading />;
    case "error":
      return <GamesListError onRetry={onRetry} isRetrying={isRetrying} />;
    case "empty":
      return (
        <GamesListEmpty nbaDate={nbaDate} nextGameDay={screen.nextGameDay} />
      );
    case "games":
    case "stale":
      return (
        <div className="flex flex-col gap-3">
          {screen.kind === "stale" && (
            <StaleScoresNotice minutesAgo={screen.minutesAgo} />
          )}
          <div className={GAMES_GRID_CLASS_NAME}>
            {screen.cards.map((card) => (
              <GameCard key={card.game.id} card={card} />
            ))}
          </div>
        </div>
      );
  }
}
