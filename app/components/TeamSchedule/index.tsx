import type { ReactNode } from "react";
import type { Game, GameCompetitor } from "@/app/lib/domain/game";
import TeamLogo from "@/app/components/TeamLogo";
import { strings } from "@/app/lib/strings";
import { formatNbaDate } from "@/app/lib/time/nba-date";
import GameTime from "@/app/components/GameTime";

const LOGO_DISPLAY_SIZE = 24;

type TeamScheduleProps = {
  teamId: string;
  games: Game[];
};

function sidesOf(game: Game, teamId: string) {
  const isHome = game.home.team.id === teamId;
  return {
    isHome,
    team: isHome ? game.home : game.away,
    opponent: isHome ? game.away : game.home,
  };
}

function Opponent({
  opponent,
  isHome,
}: {
  opponent: GameCompetitor;
  isHome: boolean;
}) {
  const formatOpponentLabel = isHome
    ? strings.team.schedule.versus
    : strings.team.schedule.at;

  return (
    <span className="flex grow items-center gap-2">
      <TeamLogo logoUrl={opponent.team.logoUrl} size={LOGO_DISPLAY_SIZE} lazy />
      {formatOpponentLabel(opponent.team.displayName)}
    </span>
  );
}

function UpcomingStatus({ game }: { game: Game }) {
  switch (game.status.kind) {
    case "scheduled":
      return <GameTime startTime={game.startTime} showDate />;
    case "postponed":
      return strings.gameStatus.postponed;
    case "canceled":
      return strings.gameStatus.canceled;
    default:
      return strings.team.schedule.inProgress;
  }
}

function ScheduleSection({
  headingId,
  title,
  emptyMessage,
  children,
}: {
  headingId: string;
  title: string;
  emptyMessage: string;
  children: ReactNode[];
}) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="font-display text-2xl tracking-[0.06em]">
        {title}
      </h2>
      {children.length > 0 ? (
        <ul className="flex flex-col gap-2">{children}</ul>
      ) : (
        <p className="text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}

const ROW_CLASS_NAME = "flex items-center gap-3 card px-4 py-3 text-sm";

export default function TeamSchedule({ teamId, games }: TeamScheduleProps) {
  const pastGames = games.filter((game) => game.status.kind === "final");
  const upcomingGames = games.filter((game) => game.status.kind !== "final");

  return (
    <div className="flex flex-col gap-6">
      <ScheduleSection
        headingId="team-schedule-results"
        title={strings.team.schedule.results}
        emptyMessage={strings.team.schedule.noResults}
      >
        {pastGames.map((game) => {
          const { isHome, team, opponent } = sidesOf(game, teamId);
          return (
            <li key={game.id} className={ROW_CLASS_NAME}>
              <span className="w-48 text-secondary">
                {formatNbaDate(game.nbaDate)}
              </span>
              <Opponent opponent={opponent} isHome={isHome} />
              <span className="font-bold tabular-nums">
                {strings.team.schedule.result(
                  // Derived from the scores, since ESPN can leave the winner flag out of a final game.
                  team.score > opponent.score,
                  team.score,
                  opponent.score,
                )}
              </span>
            </li>
          );
        })}
      </ScheduleSection>
      <ScheduleSection
        headingId="team-schedule-upcoming"
        title={strings.team.schedule.upcoming}
        emptyMessage={strings.team.schedule.noUpcoming}
      >
        {upcomingGames.map((game) => {
          const { isHome, opponent } = sidesOf(game, teamId);
          return (
            <li key={game.id} className={ROW_CLASS_NAME}>
              <span className="w-48 text-secondary">
                <UpcomingStatus game={game} />
              </span>
              <Opponent opponent={opponent} isHome={isHome} />
            </li>
          );
        })}
      </ScheduleSection>
    </div>
  );
}
