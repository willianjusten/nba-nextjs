import { Game } from "@/app/api/types";
import { Table, TableCell } from "@/app/components";

export type StatisticProps = {
  homeStatistic: string | number;
  visitorStatistic: string | number;
  label: string;
};

type TeamStatsProps = {
  game: Game;
};

function Statistic({ homeStatistic, visitorStatistic, label }: StatisticProps) {
  return (
    <tr>
      <TableCell>{homeStatistic}</TableCell>
      <TableCell>{label}</TableCell>
      <TableCell>{visitorStatistic}</TableCell>
    </tr>
  );
}

function TeamStats({ game }: TeamStatsProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Team Stats</h1>
      <Table>
        <tbody>
          <tr>
            <TableCell className="min-w-[90px] bg-slate-900 font-bold">
              {game.homeTeam.teamName}
            </TableCell>
            <TableCell className="min-w-[150px] bg-slate-900 font-bold">
              Stats
            </TableCell>
            <TableCell className="min-w-[90px] bg-slate-900 font-bold">
              {game.awayTeam.teamName}
            </TableCell>
          </tr>

          <Statistic
            homeStatistic={`${game.homeTeam.statistics.fieldGoalsMade} / ${game.homeTeam.statistics.fieldGoalsAttempted}`}
            visitorStatistic={`${game.awayTeam.statistics.fieldGoalsMade} / ${game.awayTeam.statistics.fieldGoalsAttempted}`}
            label="Field Goals"
          />

          <Statistic
            homeStatistic={`${game.homeTeam.statistics.threePointersMade} / ${game.homeTeam.statistics.threePointersAttempted}`}
            visitorStatistic={`${game.awayTeam.statistics.threePointersMade} / ${game.awayTeam.statistics.threePointersAttempted}`}
            label="3 Pointers"
          />

          <Statistic
            homeStatistic={`${game.homeTeam.statistics.freeThrowsMade} / ${game.homeTeam.statistics.freeThrowsAttempted}`}
            visitorStatistic={`${game.awayTeam.statistics.freeThrowsMade} / ${game.awayTeam.statistics.freeThrowsAttempted}`}
            label="Free throws"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.reboundsPersonal}
            visitorStatistic={game.awayTeam.statistics.reboundsPersonal}
            label="Total Rebounds"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.reboundsTeamOffensive}
            visitorStatistic={game.awayTeam.statistics.reboundsTeamOffensive}
            label="Offensive Rebounds"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.reboundsTeamDefensive}
            visitorStatistic={game.awayTeam.statistics.reboundsTeamDefensive}
            label="Deffensive Rebounds"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.assists}
            visitorStatistic={game.awayTeam.statistics.assists}
            label="Assists"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.blocks}
            visitorStatistic={game.awayTeam.statistics.blocks}
            label="Blocks"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.steals}
            visitorStatistic={game.awayTeam.statistics.steals}
            label="Steals"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.turnoversTotal}
            visitorStatistic={game.awayTeam.statistics.turnoversTotal}
            label="Turnovers"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.pointsInThePaint}
            visitorStatistic={game.awayTeam.statistics.pointsInThePaint}
            label="Points in the paint"
          />

          <Statistic
            homeStatistic={game.homeTeam.statistics.foulsPersonal}
            visitorStatistic={game.awayTeam.statistics.foulsPersonal}
            label="Fouls - Personal"
          />
        </tbody>
      </Table>
    </div>
  );
}

export { Statistic, TeamStats };
