import type { ReactNode } from "react";
import type { Game, GameCompetitor, Team } from "@/app/lib/domain/game";
import type {
  BoxScoreStats,
  GameLeader,
  GameSide,
  Play,
  TeamBoxScore,
  WinProbabilityPoint,
} from "@/app/lib/domain/game-summary";
import TeamLogo from "@/app/components/TeamLogo";
import { strings } from "@/app/lib/strings";
import GameStatusLabel, {
  hasScore,
  periodLabel,
} from "@/app/components/GameStatusLabel";

const LOGO_DISPLAY_SIZE = 56;
const BOX_SCORE_COLUMNS = Object.keys(
  strings.game.boxScore.columns,
) as (keyof BoxScoreStats)[];
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

function Section({
  headingId,
  title,
  children,
}: {
  headingId: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="font-display text-2xl tracking-[0.06em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function HeaderTeam({
  competitor,
  showScore,
}: {
  competitor: GameCompetitor;
  showScore: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <TeamLogo logoUrl={competitor.team.logoUrl} size={LOGO_DISPLAY_SIZE} />
      <span className="font-medium">{competitor.team.displayName}</span>
      {showScore && (
        <span className="font-display text-5xl leading-none">
          {competitor.score}
        </span>
      )}
    </div>
  );
}

export function GameHeader({ game }: { game: Game }) {
  const showScore = hasScore(game.status);

  return (
    <header className="flex flex-col gap-4 card p-4">
      <h1 className="text-center font-display text-4xl leading-none tracking-[0.01em]">
        {strings.game.title(
          game.away.team.displayName,
          game.home.team.displayName,
        )}
      </h1>
      <div className="grid grid-cols-3 items-center">
        <HeaderTeam competitor={game.away} showScore={showScore} />
        <p className="text-center text-secondary">
          <GameStatusLabel status={game.status} startTime={game.startTime} />
        </p>
        <HeaderTeam competitor={game.home} showScore={showScore} />
      </div>
      <p className="text-center text-xs text-muted">
        <span className="sr-only">{strings.broadcast.label}</span>
        {game.broadcasts
          .map((broadcast) => broadcast.name)
          .join(strings.broadcast.separator)}
      </p>
    </header>
  );
}

export function LineScore({
  game,
  lineScore,
}: {
  game: Game;
  lineScore: GameSide<number[]>;
}) {
  const periodCount = Math.max(lineScore.home.length, lineScore.away.length);
  if (periodCount === 0) return null;

  const periods = Array.from({ length: periodCount }, (_, index) => index + 1);
  const rows = [
    { competitor: game.away, periodScores: lineScore.away },
    { competitor: game.home, periodScores: lineScore.home },
  ];

  return (
    <Section headingId="game-line-score" title={strings.game.lineScore.title}>
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-muted">
            <th scope="col" className="text-left">
              {strings.game.lineScore.team}
            </th>
            {periods.map((period) => (
              <th key={period} scope="col">
                {periodLabel(period)}
              </th>
            ))}
            <th scope="col">{strings.game.lineScore.total}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ competitor, periodScores }) => (
            <tr key={competitor.team.id}>
              <th scope="row" className="text-left">
                {competitor.team.abbreviation}
              </th>
              {periods.map((period) => (
                <td key={period} className="text-center">
                  {periodScores[period - 1] ?? ""}
                </td>
              ))}
              <td className="text-center font-bold">{competitor.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

function TeamLeaders({ team, leaders }: { team: Team; leaders: GameLeader[] }) {
  return (
    <div className="flex flex-col gap-2 card p-4">
      <h3 className="font-bold">{team.displayName}</h3>
      {leaders.length === 0 ? (
        <p className="text-sm text-muted">{strings.game.leaders.empty}</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">
          {leaders.map(({ stat, leader }) => (
            <li key={stat} className="flex gap-2">
              <span className="w-24 text-muted">
                {strings.leaders.categories[stat].title}
              </span>
              <span className="grow font-medium">
                {leader.athlete.displayName}
              </span>
              <span className="tabular-nums">{leader.displayValue}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GameLeaders({
  game,
  leaders,
}: {
  game: Game;
  leaders: GameSide<GameLeader[]>;
}) {
  return (
    <Section headingId="game-leaders" title={strings.game.leaders.title}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TeamLeaders team={game.away.team} leaders={leaders.away} />
        <TeamLeaders team={game.home.team} leaders={leaders.home} />
      </div>
    </Section>
  );
}

export function WinProbability({
  game,
  points,
}: {
  game: Game;
  points: WinProbabilityPoint[];
}) {
  const latestPoint = points.at(-1);

  return (
    <Section
      headingId="game-win-probability"
      title={strings.game.winProbability.title}
    >
      {latestPoint ? (
        <div className="flex flex-col gap-2 card p-4 text-sm">
          <p className="flex justify-between tabular-nums">
            <span>
              {strings.game.winProbability.chance(
                game.away.team.abbreviation,
                percentFormatter.format(1 - latestPoint.homeWinPercentage),
              )}
            </span>
            <span>
              {strings.game.winProbability.chance(
                game.home.team.abbreviation,
                percentFormatter.format(latestPoint.homeWinPercentage),
              )}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-muted">{strings.game.winProbability.empty}</p>
      )}
    </Section>
  );
}

function StatCells({ stats }: { stats: BoxScoreStats }) {
  return BOX_SCORE_COLUMNS.map((column) => (
    <td key={column} className="px-2 text-center">
      {stats[column]}
    </td>
  ));
}

export function BoxScore({
  team,
  boxScore,
}: {
  team: Team;
  boxScore: TeamBoxScore;
}) {
  if (boxScore.players.length === 0) return null;

  return (
    <Section
      headingId={`game-box-score-${team.id}`}
      title={strings.game.boxScore.title(team.displayName)}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap tabular-nums">
          <thead>
            <tr className="text-muted">
              <th scope="col" className="text-left">
                {strings.game.boxScore.player}
              </th>
              {BOX_SCORE_COLUMNS.map((column) => (
                <th key={column} scope="col" className="px-2">
                  {strings.game.boxScore.columns[column]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boxScore.players.map(
              ({ athlete, starter, stats, didNotPlayReason }) => (
                <tr key={athlete.id}>
                  <th scope="row" className="text-left font-medium">
                    {athlete.shortName}
                    {starter && (
                      <span className="ml-1 text-xs text-muted">
                        {athlete.position}
                      </span>
                    )}
                  </th>
                  {stats ? (
                    <StatCells stats={stats} />
                  ) : (
                    <td
                      colSpan={BOX_SCORE_COLUMNS.length}
                      className="px-2 text-muted"
                    >
                      {didNotPlayReason &&
                        strings.game.boxScore.didNotPlay(didNotPlayReason)}
                    </td>
                  )}
                </tr>
              ),
            )}
          </tbody>
          {boxScore.totals && (
            <tfoot>
              <tr className="font-bold">
                <th scope="row" className="text-left">
                  {strings.game.boxScore.totals}
                </th>
                <StatCells stats={boxScore.totals} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Section>
  );
}

export function PlayByPlay({ game, plays }: { game: Game; plays: Play[] }) {
  const abbreviationByTeamId = new Map(
    [game.home.team, game.away.team].map((team) => [
      team.id,
      team.abbreviation,
    ]),
  );

  return (
    <Section headingId="game-plays" title={strings.game.plays.title}>
      {plays.length === 0 ? (
        <p className="text-muted">{strings.game.plays.empty}</p>
      ) : (
        // Newest first, so a live game's latest plays are on top.
        <ol reversed className="flex flex-col-reverse gap-1 text-sm">
          {plays.map((play) => (
            <li
              key={play.id}
              className={`flex gap-3 rounded px-2 py-1 ${play.scoringPlay ? "bg-white/5" : ""}`}
            >
              <span className="w-16 shrink-0 text-muted tabular-nums">
                {periodLabel(play.period)} {play.clock}
              </span>
              <span className="w-10 shrink-0 text-muted">
                {play.teamId ? abbreviationByTeamId.get(play.teamId) : ""}
              </span>
              <span className="grow">{play.text}</span>
              <span className="shrink-0 tabular-nums">
                {strings.game.plays.score(play.awayScore, play.homeScore)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
