import { Table, TableCell, TableHead } from "@/components/Table";

export function GameSummary({ game }) {
  const renderPeriods = (periods, isHeader = false) =>
    periods.map(({ period, score }) => {
      const key = isHeader ? period : score;
      const content = isHeader
        ? period > 4
          ? `OT${period - 4}`
          : `Q${period}`
        : score;

      return <TableCell key={key}>{content}</TableCell>;
    });

  return (
    <div className="py-5">
      <h1 className="text-2xl font-semibold">Game Summary</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <tr className="border border-main">
              <TableCell>Team</TableCell>
              {renderPeriods(game.homeTeam.periods, true)}
            </tr>
          </TableHead>
          <tbody>
            <tr>
              <TableCell>{game.homeTeam.teamName}</TableCell>
              {renderPeriods(game.homeTeam.periods)}
            </tr>
            <tr>
              <TableCell>{game.awayTeam.teamName}</TableCell>
              {renderPeriods(game.awayTeam.periods)}
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
