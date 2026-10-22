import type { Broadcast, Game, GameCompetitor } from "@/app/lib/domain/game";
import { resizedLogoUrl } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";
import GameStatusLabel, { hasScore } from "@/app/components/GameStatusLabel";

const LOGO_DISPLAY_SIZE = 40;
// Requested at twice the display size so logos stay sharp on high-density screens.
const LOGO_REQUEST_SIZE = LOGO_DISPLAY_SIZE * 2;

function CompetitorRow({
  competitor,
  showScore,
}: {
  competitor: GameCompetitor;
  showScore: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={resizedLogoUrl(competitor.team.logoUrl, LOGO_REQUEST_SIZE)}
        alt=""
        width={LOGO_DISPLAY_SIZE}
        height={LOGO_DISPLAY_SIZE}
        loading="lazy"
      />
      <span className="grow font-medium">{competitor.team.displayName}</span>
      {showScore && (
        <span className="text-xl font-bold tabular-nums">
          {competitor.score}
        </span>
      )}
    </div>
  );
}

function BroadcastLine({ broadcasts }: { broadcasts: Broadcast[] }) {
  if (broadcasts.length === 0) {
    return null;
  }

  return (
    <p className="text-xs text-slate-400">
      <span className="sr-only">{strings.broadcast.label}</span>
      {broadcasts
        .map((broadcast) => broadcast.name)
        .join(strings.broadcast.separator)}
    </p>
  );
}

export default function GameCard({ game }: { game: Game }) {
  const showScore = hasScore(game.status);

  return (
    <article className="flex flex-col gap-3 rounded-lg bg-glass p-4">
      <p className="text-sm text-slate-300">
        <GameStatusLabel status={game.status} startTime={game.startTime} />
      </p>
      <CompetitorRow competitor={game.away} showScore={showScore} />
      <CompetitorRow competitor={game.home} showScore={showScore} />
      <BroadcastLine broadcasts={game.broadcasts} />
    </article>
  );
}
