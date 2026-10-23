import Link from "next/link";
import type { GameCompetitor } from "@/app/lib/domain/game";
import { hasScore, isInProgress } from "@/app/lib/game/status";
import type { HomeCard, TeamWinProbability } from "@/app/lib/home/home-view";
import type { TeamSide } from "@/app/lib/home/team-colors";
import { strings } from "@/app/lib/strings";
import TeamLogo from "@/app/components/TeamLogo";
import GameStatusChip from "@/app/components/StatusChip";

const ROW_LOGO_SIZE = 34;
const MATCHUP_LOGO_SIZE = 44;
const TEAM_NAME_CLASS_NAME =
  "font-display text-xl leading-none tracking-[0.04em]";

function FavoriteStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={strings.myTeams.favorite}
      className="size-[11px] shrink-0 fill-favorite"
    >
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

function TeamName({
  competitor,
  isFavorite,
}: {
  competitor: GameCompetitor;
  isFavorite: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${TEAM_NAME_CLASS_NAME}`}>
      {competitor.team.name}
      {isFavorite && <FavoriteStar />}
    </span>
  );
}

function TeamRecord({ record }: { record: string | null }) {
  return record && <span className="text-meta text-muted">{record}</span>;
}

function ScoreRow({
  competitor,
  color,
  isFavorite,
  isLeading,
  isLive,
  isFinal,
}: {
  competitor: GameCompetitor;
  color: string;
  isFavorite: boolean;
  isLeading: boolean;
  isLive: boolean;
  isFinal: boolean;
}) {
  const isFinalLoser = isFinal && !isLeading;

  return (
    <div
      className={`flex items-center gap-2.5 ${isFinalLoser ? "opacity-56" : ""}`}
    >
      <TeamLogo
        logoUrl={competitor.team.logoUrl}
        size={ROW_LOGO_SIZE}
        fallbackColor={color}
        lazy
      />
      <span className="flex grow flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <TeamName competitor={competitor} isFavorite={isFavorite} />
        <TeamRecord record={competitor.record} />
      </span>
      <span
        className={`font-display text-3xl leading-none ${isLive && isLeading ? "text-link" : ""}`}
      >
        {competitor.score}
      </span>
      {isFinal && (
        <span className="flex w-3.5 justify-center">
          {isLeading && (
            <svg
              viewBox="0 0 24 24"
              role="img"
              aria-label={strings.gameCard.winner}
              className="size-3.5"
            >
              <path
                d="M4 12l6 6L20 6"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="text-accent"
              />
            </svg>
          )}
        </span>
      )}
    </div>
  );
}

function MatchupTeam({
  competitor,
  color,
  isFavorite,
}: {
  competitor: GameCompetitor;
  color: string;
  isFavorite: boolean;
}) {
  return (
    <div className="flex grow basis-0 flex-col items-center gap-1.5 text-center">
      <TeamLogo
        logoUrl={competitor.team.logoUrl}
        size={MATCHUP_LOGO_SIZE}
        fallbackColor={color}
        lazy
      />
      <TeamName competitor={competitor} isFavorite={isFavorite} />
      <TeamRecord record={competitor.record} />
    </div>
  );
}

function WinProbabilityBar({
  winProbability,
  teamColors,
}: {
  winProbability: Record<TeamSide, TeamWinProbability>;
  teamColors: Record<TeamSide, string>;
}) {
  const teamLabelOf = (side: TeamSide) =>
    strings.gameCard.teamWinProbability(
      winProbability[side].abbreviation,
      winProbability[side].percent,
    );
  const segmentOf = (side: TeamSide) => (
    <span
      className="basis-0"
      style={{
        // Grows from zero so both segments share what the gap leaves, in proportion.
        flexGrow: winProbability[side].percent,
        backgroundColor: teamColors[side],
      }}
    />
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[10px] tracking-[0.14em] text-muted uppercase">
        <span>{teamLabelOf("away")}</span>
        <span>{strings.gameCard.winProbability}</span>
        <span>{teamLabelOf("home")}</span>
      </div>
      {/* The labels above carry the numbers, so the bar is decoration. */}
      <div
        aria-hidden="true"
        className="flex h-1.5 gap-[2%] overflow-hidden rounded-full bg-white/8"
      >
        {segmentOf("away")}
        {segmentOf("home")}
      </div>
    </div>
  );
}

function TopScorerTile({ label }: { label: string }) {
  return (
    <p className="flex flex-col rounded-tile border border-white/9 bg-white/5 px-3 py-2">
      <span className="text-[9px] tracking-[0.14em] text-muted uppercase">
        {strings.gameCard.topScorer}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </p>
  );
}

function CardAction({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "accent" | "neutral";
  children: React.ReactNode;
}) {
  const toneClassName =
    tone === "accent"
      ? "border-accent/42 bg-accent/14 text-accent-soft hover:bg-accent/22"
      : "border-white/14 bg-white/5 text-foreground hover:bg-white/10";

  return (
    // Sits above the card-wide link so it stays clickable on its own, and at the bottom so actions line up across a row of cards.
    <Link
      href={href}
      className={`relative z-10 mt-auto flex min-h-11 items-center justify-center gap-2 rounded-tile border text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${toneClassName}`}
    >
      {children}
    </Link>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function GameCard({ card }: { card: HomeCard }) {
  const { game, leadingSide, teamColors, favoriteSides } = card;
  const gameCenterHref = `/game/${game.id}`;
  const isLive = isInProgress(game.status);
  const isFinal = game.status.kind === "final";
  const scoreRowOf = (side: TeamSide) => (
    <ScoreRow
      competitor={game[side]}
      color={teamColors[side]}
      isFavorite={favoriteSides[side]}
      isLeading={leadingSide === side}
      isLive={isLive}
      isFinal={isFinal}
    />
  );

  return (
    <article
      className={`card relative flex flex-col gap-3 p-4 ${isLive ? "border-live/34 bg-linear-to-b from-live/14 to-elevated to-50%" : "border-white/10 bg-white/4.5"} ${card.isMyTeam ? "inset-ring inset-ring-favorite/22" : ""}`}
    >
      {/* Stretched over the whole card so tapping anywhere opens the game center; first so it is also first in tab order. */}
      <Link
        href={gameCenterHref}
        className="absolute inset-0 rounded-card transition-colors hover:bg-white/3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="sr-only">
          {strings.game.title(
            game.away.team.displayName,
            game.home.team.displayName,
          )}
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <GameStatusChip
          status={game.status}
          label={card.statusLabel}
          startTime={game.startTime}
        />
        <span
          className={`ml-auto truncate text-meta ${isLive ? "text-secondary" : "text-muted"}`}
        >
          {card.metaLabel}
        </span>
      </div>

      {hasScore(game.status) ? (
        <div className="flex flex-col gap-2.5">
          {scoreRowOf("away")}
          {scoreRowOf("home")}
        </div>
      ) : (
        <div className="flex items-center gap-4 py-1.5">
          <MatchupTeam
            competitor={game.away}
            color={teamColors.away}
            isFavorite={favoriteSides.away}
          />
          <span className="font-display text-base text-muted">
            {strings.gameCard.at}
          </span>
          <MatchupTeam
            competitor={game.home}
            color={teamColors.home}
            isFavorite={favoriteSides.home}
          />
        </div>
      )}

      {card.winProbability && (
        <WinProbabilityBar
          winProbability={card.winProbability}
          teamColors={teamColors}
        />
      )}
      {card.topScorerLabel && <TopScorerTile label={card.topScorerLabel} />}

      {card.venueLabel && (
        <p className="truncate text-center text-meta text-muted">
          {card.venueLabel}
        </p>
      )}

      {card.showHighlights && (
        <CardAction href={gameCenterHref} tone="neutral">
          <PlayIcon />
          {strings.gameCard.highlights}
        </CardAction>
      )}
      {isLive && (
        <CardAction href={gameCenterHref} tone="accent">
          {strings.gameCard.gameDetails}
          <ArrowIcon />
        </CardAction>
      )}
    </article>
  );
}
