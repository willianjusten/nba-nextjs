import { Team } from "@/app/api/types";
import { Table, TableCell, TableHead } from "@/app/components";

const extractMinutes = (str: string) => {
  const match = str.match(/PT(\d+)M/);
  return match ? Number(match[1]) : null;
};

type PlayersStatsProps = {
  team: Team;
};

function PlayersStats({ team }: PlayersStatsProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {team.teamCity} {team.teamName}
      </h1>
      <Table>
        <TableHead>
          <tr>
            <TableCell className="min-w-[120px] text-left sm:min-w-full">
              Player
            </TableCell>
            <TableCell>MIN</TableCell>
            <TableCell>PTS</TableCell>
            <TableCell>REB</TableCell>
            <TableCell>AST</TableCell>
            <TableCell>+/-</TableCell>
          </tr>
        </TableHead>
        <tbody>
          {team.players.map((player) => (
            <tr key={player.personId}>
              <TableCell className="text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex w-[20px] shrink-0 justify-end opacity-40">
                    {player.jerseyNum}
                  </span>
                  <span className="truncate">{player.nameI}</span>
                </div>
              </TableCell>
              <TableCell>
                {extractMinutes(player.statistics.minutesCalculated)}
              </TableCell>
              <TableCell>{player.statistics.points}</TableCell>
              <TableCell>{player.statistics.reboundsTotal}</TableCell>
              <TableCell>{player.statistics.assists}</TableCell>
              <TableCell>{player.statistics.plusMinusPoints}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PlayersStats;
