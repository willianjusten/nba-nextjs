import { Table, TableCell, TableHead } from "@/components";

const extractMinutes = (str: string) => {
  const match = str.match(/PT(\d+)M/);
  return match ? Number(match[1]) : null;
};

export default function PlayersStats({ team }) {
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
            <TableCell>REB</TableCell>
            <TableCell>AST</TableCell>
            <TableCell>PTS</TableCell>
            <TableCell>+/-</TableCell>
          </tr>
        </TableHead>
        <tbody>
          {team.players.map((player) => (
            <tr key={player.jerseyNum}>
              <TableCell className="truncate text-left">
                {player.nameI}
              </TableCell>
              <TableCell>
                {extractMinutes(player.statistics.minutesCalculated)}
              </TableCell>
              <TableCell>{player.statistics.reboundsTotal}</TableCell>
              <TableCell>{player.statistics.assists}</TableCell>
              <TableCell>{player.statistics.points}</TableCell>
              <TableCell>{player.statistics.plusMinusPoints}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
